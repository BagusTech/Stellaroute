console.log('~~~~ Starting Stellroute ~~~~');

const express          = require('express');
const csrf             = require('csurf');
const path             = require('path');
const passport         = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const flash            = require('connect-flash');
const favicon          = require('serve-favicon');
const cookieParser     = require('cookie-parser');
const bodyParser       = require('body-parser');
const session          = require('cookie-session');

const getUser          = require('./middleware/getUser');
const isLoggedIn       = require('./middleware/isLoggedIn');
const globalPugVariablesAndFunctions = require('./middleware/globalPugVariablesAndFunctions');

const setFlash         = require('./modules/setFlash');

const routes           = require('./routes/index');
const admin            = require('./routes/admin');
const ajax             = require('./routes/ajax');
const locations        = require('./routes/locations');

const Guide            = require('./schemas/guide');
//const Attraction       = require('./schemas/attraction');
//const Continent        = require('./schemas/continent');
//const WorldRegion      = require('./schemas/world-region');
const Country          = require('./schemas/country');
//const CountryRegion    = require('./schemas/country-region');
//const Province         = require('./schemas/province');
//const ProvinceRegion   = require('./schemas/province-region');
//const City             = require('./schemas/city');
//const CityRegion       = require('./schemas/city-region');
//const Neighborhood     = require('./schemas/neighborhood');
const User             = require('./schemas/user');

const fs               = require('fs');
const app              = express();
let startTime, startUrl;

function redirectUrl(req, res) {
  if (req.method === "GET") {
    res.redirect(301, "https://" + req.headers.host + req.originalUrl);
  } else {
    res.status(403).send("Please use HTTPS when submitting data to this server.");
  }
};

function enforceSubdomain(req, res, next) {
    console.log(req, req.headers, req.headers.host)
    const domainParts = req && req.headers && req.headers.host && req.headers.host.split('.');

    if (!domainParts || (domainParts[0] !== 'www' && domainParts[0] !== 'staging')) {
        req.headers.host = `www.${req.headers.host}`
        redirectUrl(req, res);
        return;
    }

    res.locals.env = domainParts[0] === 'www' ? app.get('env') : 'staging';

    next();
};

function enforceHTTPS(req, res, next) {
    const isHttps = req.secure;

    if (!isHttps) {
      redirectUrl(req, res);
      return;
    }

   next();
};

app.use((req, res, next) => {
    startTime = new Date();
    startUrl = req.url;
    //console.log('start: ', startUrl)
    next();
})

if(app.get('env') === 'production') {
    app.use(require('compression')())
    app.use(enforceSubdomain);
    app.use(enforceHTTPS);
}

app.use((req, res, next) => {
    //console.log('enforce https: ', startTime - new Date(), startUrl);
    next();
});

app.get('/robots.txt', (req, res, next) => {
    res.type('text/plain');

    if (res.locals.env === 'production') {
        res.send('User-agent: *\nDisallow: /ajax\nDisallow: /admin');
    } else {
        res.send('User-agent: *\nDisallow: /');
    }
});

// Set up the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// App configuration ///////////////////////////////////////////////////
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json()); // needed for post requests, still figuring out what it does
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // Sets the public folder to be available available to the front end

app.use((req, res, next) => {
    //console.log('set favicon, parsers, and public dir: ', startTime - new Date(), startUrl);
    next();
})

// required for passport
app.set('trust proxy', 1) // trust first proxy
app.use(session({
        name: 'sessionForStellaroute',
        keys: ['key1', 'key2']
    }
)); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(flash()); // use connect-flash for flash messages stored in session
app.use(setFlash);

app.use((req, res, next) => {
    //console.log('session, passport, and flash: ', startTime - new Date(), startUrl);
    next();
})

// for securing ajax
app.use(csrf({ cookie: true }));
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    //console.log('csrf: ', startTime - new Date(), startUrl);
    next();
})

// get the user
app.use(getUser);

// assign global variables and functions for the view
app.use(globalPugVariablesAndFunctions);

app.use((req, res, next) => {
    //console.log('get user and globals: ', startTime - new Date(), startUrl);
    next();
})

// location cache
app.use(Guide.getCached(),
        //Attraction.getCached(),
        //Continent.getCached(),
        //WorldRegion.getCached(),
        Country.getCached(),
        //CountryRegion.getCached(),
        //Province.getCached(),
        //ProvinceRegion.getCached(),
        //City.getCached(),
        //CityRegion.getCached(),
        //Neighborhood.getCached(),
        User.getCached());

app.use((req, res, next) => {
    //console.log('cached: ', startTime - new Date(), startUrl);
    next();
});

app.use('/', routes);

app.use((req, res, next) => {
    //console.log('routes (index): ', startTime - new Date(), startUrl);
    next();
})

// CRUD
app.use('/', ajax);

app.use((req, res, next) => {
    //console.log('ajax routes: ', startTime - new Date(), startUrl);
    next();
})

app.use('/admin', isLoggedIn(true), admin);

app.use((req, res, next) => {
    //console.log('admin routes: ', startTime - new Date(), startUrl);
    next();
})

// view locations
app.use('/', locations);

app.use((req, res, next) => {
    //console.log('locations routes: ', startTime - new Date(), startUrl);
    next();
})

// error handlers /////////////////////////////////////////////////////

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');

    console.error('~~~~ 404 - Not Found ~~~');
    console.error(req.url, new Date());
    console.error('~~~~~~ End Error ~~~~~~~');
    
    err.status = 404;
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
    console.log(err)
    res.render('error', {
        message: err.message,
        error: {}
    });
});

console.log(`~~~~ Stellroute Has Started at ${new Date()} ~~~~`);
console.log('Current Environment: ' + app.get('env'));

module.exports = app;