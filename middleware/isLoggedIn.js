const instagram = require('../config/instagram');

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    // or if user is going to the home or login page
    if (req.isAuthenticated()){
		if(req.user){
			res.locals.user = req.user;
			console.log('true');

			if(req.user.instagram){
				instagram.user(req.user.instagram, function(err, result, remaining, limit){
					res.locals.user.instagram = result;

					return next();
				});
			} else {
				return next();
			}
		} else {
			return next();
		}
	} else {
		// if they aren't redirect them to the home page
		res.redirect('/');
	}
}

module.exports = isLoggedIn;