const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Replace with your Google Client ID and Secret
const GOOGLE_CLIENT_ID = '677015174898-lnh0rq65p6erdtldg4r8fmptkt60ucv2.apps.googleusercontent.com' ;
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
},
(accessToken, refreshToken, profile, done) => {
    // Process user profile and save in the database
    console.log('User Profile:', profile);
    done(null, profile);
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});
