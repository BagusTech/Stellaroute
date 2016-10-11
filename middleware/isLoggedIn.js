const instagram = require('../config/instagram');

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    // or if user is going to the home or login page
    if (req.isAuthenticated() || req.originalUrl === '/' || req.originalUrl.indexOf('/auth') > -1 || req.originalUrl === '/signup' || req.originalUrl === '/newsletter-signup' || req.originalUrl === '/request-location' || req.originalUrl === '/privacy-and-terms'){
		if(req.user){
			res.locals.user = req.user;

			instagram.user(req.user.instagram, function(err, result, remaining, limit){
				res.locals.user.instagram = result;

				return next();
			});
		} else {
			return next();
		}
	} else {
		// if they aren't redirect them to the home page
		res.redirect('/');
	}
}

module.exports = isLoggedIn;