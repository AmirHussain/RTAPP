const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(new GoogleStrategy({
    clientID: '511589440855-2tkfvlo0s1h1rnhm8c4skeaf8ciib7q0.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    // Verify or create user logic goes here
    // 'done' should be called with the user object
  }));

  module.exports={passport}