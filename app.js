var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var allroutes = require('./api/router');

var passport = require('passport');
var mysql = require('promise-mysql');

var app = express();
const cors = require('cors');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', allroutes);

app.use(passport.initialize());
app.use(passport.session());

require('./authenticate');

app.get('/google', passport.authenticate('google', {scope: ['email', 'profile']}));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '' }), (req, res) =>
{
  //res.redirect('');

  var f_name = req.user._json.given_name;
  var l_name = req.user._json.family_name;
  var email = req.user._json.email;

  var connection = require('./dbConnection');

  connection.query('INSERT INTO users (f_name, l_name, email) VALUES (?, ?, ?)', [f_name, l_name, email], function( err, res, fields){
  if(err) throw err;
  })
  
  console.log(req.user.name);
  res.end('Logged in.');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
