var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var allroutes = require('./api/router');
var passport = require('passport');
const { passAuth } = require("./api/controller/authenticate.js");
//const config = require('./config.js');


var passport = require('passport');
var mysql = require('promise-mysql');

var app = express();
const cors = require('cors');
const { postRegisterNewUser } = require('./api/controller/controller');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api', allroutes);


var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);

})

passport.deserializeUser((user, done) => {
    done(null, user.id);

})

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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


// app.post('/auth/google/callback', passport.authenticate('google', passport.authenticate('google', { failureRedirect: '' }), postRegisterNewUser));

// app.use('/', )
app.get('/google', passport.authenticate('google', {scope: ['email', 'profile']}));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  postRegisterNewUser);
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
