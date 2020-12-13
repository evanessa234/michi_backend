const express = require('express');
// const db = require('../../dbConnection');
// require('dotenv').config();

var passport = require('passport');
var mysql = require('promise-mysql');

const config = require('../../config.js');

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);

})

passport.deserializeUser((user, done) => {
    done(null, user.id);

})

passport.use(new GoogleStrategy({
    clientID: config.auth.GOOGLE_CLIENT_ID,
    clientSecret: config.auth.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    /* register user
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
    */
    //console.log(profile);
    cb(null, profile);
  }
)); 

var passAuth = passport.authenticate('google', { failureRedirect: '' })

module.exports = {passAuth}