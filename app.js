var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// const express = require('express')
// const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport');
const cookieSession = require('cookie-session')
require('./api/controller/passport-setup');
const { postRegisterNewUser } = require('./api/controller/controller');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var allroutes = require('./api/router')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', allroutes)

app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }))

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => res.send('Example Home page!'))
app.get('/failed', (req, res) => res.send('You Failed to log in!'))

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get('/good', isLoggedIn, (req, res) => res.send(`Welcome mr ${req.user.displayName}!`))

// Auth Routes
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }), postRegisterNewUser);
  // function(req, res) {
  //   // Successful authentication, redirect home.
  //   res.redirect('/good');
  // }
// );

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})

// app.listen(3000, () => console.log(`Example app listening on port ${3000}!`))

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
// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var allroutes = require('./api/router')

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/api', allroutes);


// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;



// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var allroutes = require('./api/router');
// var passport = require('passport');
// const { passAuth } = require("./api/controller/authenticate.js");
// const config = require('./config.js');



// var app = express();
// const cors = require('cors');
// // const { postRegisterNewUser } = require('./api/controller/controller');
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors());

// // app.use(passport.initialize());
// // app.use(passport.session());

// // app.use('/', indexRouter);
// // app.use('/users', usersRouter);
// app.use('/api', allroutes);


// // var passport = require('passport');
// // var GoogleStrategy = require('passport-google-oauth20').Strategy;

// // passport.serializeUser((user, done) => {
// //     done(null, user.id);

// // })

// // passport.deserializeUser((user, done) => {
// //     done(null, user.id);

// // })

// // passport.use(new GoogleStrategy({
// //     clientID: config.auth.GOOGLE_CLIENT_ID,
// //     clientSecret: config.auth.GOOGLE_CLIENT_SECRET,
// //     callbackURL: "http://localhost:3000/auth/google/callback"
// //   },
// //   function(accessToken, refreshToken, profile, cb) {
// //     /* register user
// //     User.findOrCreate({ googleId: profile.id }, function (err, user) {
// //       return cb(err, user);
// //     });
// //     */
// //     //console.log(profile);
// //     cb(null, profile);
// //   }
// // )); 


// // // app.post('/auth/google/callback', passport.authenticate('google', passport.authenticate('google', { failureRedirect: '' }), postRegisterNewUser));

// // // app.use('/', )
// // app.get('/google', passport.authenticate('google', {scope: ['email', 'profile']}));

// // app.get('/auth/google/callback', 
// //   passport.authenticate('google', { failureRedirect: '/error' }),
// //   postRegisterNewUser);
// // // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;
