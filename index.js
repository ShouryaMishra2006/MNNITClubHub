const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userModel = require("./models/user");
const clubRoutes = require('./routes/clubRoutes');
const eventRoutes=require('./routes/eventRoutes')
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')
const passport = require('passport');
const session = require('express-session');
const app = express();
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require('dotenv').config();
require('./passport');
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER}/auth/google/callback`,
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await userModel.findOne({ googleId: profile.id });
    if (user) {
      return done(null, user); 
    }
    user = await new userModel({
      name: profile.displayName,
      email: profile.emails[0].value,
      googleId: profile.id,
    }).save();

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

app.use(session({ secret: `${process.env.SESSION_SECRET}`, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
}), (req, res) => {
  const username = req.user.name ; 
  res.redirect(`${process.env.CORS_ORIGIN}/UserPage/${username}`);
});
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userModel.findById(id).then(user => done(null, user)).catch(err => done(err));
});

app.get('/', (req, res) => {
    res.send(req.user ?`Hello, ${req.user.displayName}! `: 'Not logged in.');
});
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: `${process.env.CORS_ORIGIN}`, credentials: true }));
const verifyUser=(req,res,next)=>{
   const token=req.cookies.token
   console.log(token)
}
app.get('/',verifyUser,(req,res)=>{
  const token=req.cookies.token
  if(!token){
     return res.json("the token is not generated")
  }
  else{
    jwt.verify(token,`${process.env.JWT_SECRET_KEY}`,(err,decoded)=>{
      if(err) return res.json("the token is not available")
    })
  }
})
mongoose
  .connect(`${process.env.MONGODB_URI}/${process.env.DATABASE_NAME}`)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));
app.post("/LoginUser", (req, res) => {
  const { email, password } = req.body;
  console.log("Email received:", email);

  userModel
    .findOne({ email: email })
    .then((user) => {
      if (user) {
        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (isMatch) {
              const token=jwt.sign({email:user.email},`${process.env.JWT_SECRET_KEY}`,{expiresIn:"1d"})
              res.cookie("token",token)
              res.json({
                success: true,
                message: "Successfully logged in",
                user: user.name,
              });
            } else {
              res.json({ success: false, message: "Incorrect password" });
            }
          })
          .catch((err) => {
            console.error("Error comparing passwords:", err);
            res
              .status(500)
              .json({ success: false, message: "Login error", error: err });
          });
      } else {
        res.json({ success: false, message: "User not registered" });
      }
    })
    .catch((err) => {
      console.error("Error during login:", err);
      res
        .status(500)
        .json({ success: false, message: "Login error", error: err });
    });
});
app.post("/RegUser", (req, res) => {
    const { name, email, password } = req.body;
    if(
      [name,email,password].some((field)=>field?.trim()==="")
    ){
      throw new Error(400,"All field are Required")
    }
    userModel.findOne({ email: email })
      .then(existingUser => {
        if (existingUser) {
          return res.status(400).json({ success: false, message: "User already registered" });
        }
        return bcrypt.hash(password, 10).then(hash => {
          return userModel.create({ name, email, password: hash });
        });
      })
      .then(user => {
        const userResponse = {
          id: user._id,
          name: user.name,
          email: user.email,
        };
        return res.status(201).json({ success: true, user: userResponse }); 
      })
      .catch(err => {
        console.error("Error creating user:", err);
        if (!res.headersSent) { 
          res.status(500).json({ success: false, message: "Failed to create user", error: err.message });
        }
      });
  });

app.use('/api', clubRoutes);
app.use('/api',eventRoutes)
const server= app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
const io= require('socket.io')(server,{
  pingTimeout:60000,
  cors:{
    origin:`${process.env.CORS_ORIGIN}`,methods: ["GET", "POST"], 
    credentials: true     
  }
})
io.on("connection",(socket)=>{
  console.log("connected to socket.io")
  socket.on('setup',(userdata)=>{
    socket.join(userdata._id)
    socket.emit("connected")
  })
  socket.on("joinRoom",(clubId)=>{
    socket.join(clubId)
    console.log("User joined the club discussion room")
  })
  socket.on('send_message', (messageData) => {
    if (messageData && messageData.receiverId) {
      io.to(messageData.receiverId).emit('receive_message', messageData);
    }
  });
  socket.on("sendMessage", (message) => {
    console.log("Message received:", message);

  //   const { chatId, senderId, content } = message;
    const {clubId,text}=message;
    console.log(clubId)
    if (clubId) {
      socket.to(clubId).emit("joinRoom", message);
      console.log(`Message broadcasted to room: ${clubId}`);
  }
  });
})  