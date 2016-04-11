const express          = require('express');
const path             = require('path');
const passport         = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const flash            = require('connect-flash');
const cache            = require('./middleware/caching');
const setFlash         = require('./modules/setFlash');
const favicon          = require('serve-favicon');
const cookieParser     = require('cookie-parser');
const bodyParser       = require('body-parser');
const session          = require('express-session');
const routes           = require('./routes/index');
const continents       = require('./routes/continents');
const countries        = require('./routes/countries');
const review           = require('./routes/review');
const profile          = require('./routes/profile');
const fs               = require('fs');
const app              = express();

//Set up the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// App configuration ///////////////////////////////////////////////////
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json()); // needed for post requests, still figuring out what it does
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //Sets the public folder to be available available to the front end

// Make the db accessible to our router
/* app.use(function(req, res, next){
  req.db = db;
  next();
}); */


// required for passport
app.use(session({ 
        secret: 'thisisthesecretpasswordforstellaroute',
        resave: false,
        saveUninitialized: false
    }
)); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(setFlash);

//Set index.js to be the main router
app.use('/', routes);
app.use('/continents', continents);
app.use('/countries', countries)
app.use('/profile', profile);
//app.use('/review', review);

// error handlers /////////////////////////////////////////////////////

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    console.error(req);
    err.status = 404;
    console.error('~~~~~~~~~~');
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        })
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

console.log('~~~~ Starting Stellroute ~~~~');
console.log('Current Environment: ' + app.get('env'));

module.exports = app;