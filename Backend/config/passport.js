const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'placeholder',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder',
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
      try {
          const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
          if (!email) {
              return done(new Error("No email found from Google profile"), null);
          }

          // Check if user already exists
          let user = await User.findOne({ email: email });
          if (user) {
              if (user.authProvider !== 'google') {
                  user.authProvider = 'google';
                  user.providerId = profile.id;
                  await user.save();
              }
              return done(null, user);
          }

          // Create new user
          user = new User({
              name: profile.displayName,
              email: email,
              authProvider: 'google',
              providerId: profile.id,
              photoUrl: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : ''
          });
          await user.save();
          done(null, user);
      } catch (error) {
          done(error, null);
      }
  }
));

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || 'placeholder',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'placeholder',
    callbackURL: "/auth/github/callback",
    scope: ['user:email']
  },
  async (accessToken, refreshToken, profile, done) => {
      try {
          const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : `${profile.username}@github.com`;
          
          let user = await User.findOne({ email: email });
          if (user) {
              if (user.authProvider !== 'github') {
                  user.authProvider = 'github';
                  user.providerId = profile.id;
                  await user.save();
              }
              return done(null, user);
          }

          user = new User({
              name: profile.displayName || profile.username,
              email: email,
              authProvider: 'github',
              providerId: profile.id,
              photoUrl: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : ''
          });
          await user.save();
          done(null, user);
      } catch (error) {
          done(error, null);
      }
  }
));

module.exports = passport;
