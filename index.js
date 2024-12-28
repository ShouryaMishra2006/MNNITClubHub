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
require('./passport');
app.use(session({ secret: 'your-session-secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'], 
}));
app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
}),
(req, res) => {
    res.redirect('/');
});
app.get('/', (req, res) => {
    res.send(req.user ? `Hello, ${req.user.displayName}!` : 'Not logged in.');
});
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
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
    jwt.verify(token,"jwt-secret-key",(err,decoded)=>{
      if(err) return res.json("the token is not available")
    })
  }
})
mongoose
  .connect("mongodb://localhost:27017/MNNITHub")
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
              const token=jwt.sign({email:user.email},"jwt-secret-key",{expiresIn:"1d"})
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
const server= app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
const io= require('socket.io')(server,{
  pingTimeout:60000,
  cors:{
    origin:'http://localhost:5173',methods: ["GET", "POST"], 
    credentials: true     
  }
})
io.on("connection",(socket)=>{
  console.log("connected to socket.io")
  socket.on('setup',(userdata)=>{
    socket.join(userdata._id)
  })
})