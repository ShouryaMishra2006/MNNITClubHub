export const isVerified = (req, res, next) => {
    if (!req.isAuthenticated()) {
       return res.redirect('/login');
    } else {
       console.log("User logged in");
       next(); 
    }
 };