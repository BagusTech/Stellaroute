// route middleware to make sure a user is logged in
function isLoggedIn(mustBeAdmin) {
	return (req, res, next) => {
	    // if user is authenticated in the session, carry on 
	    // or if user is going to the home or login page
	    if (req.isAuthenticated() && (!mustBeAdmin || (req.user && req.user.isAdmin))){
			return next();
		} else {
			// if they aren't redirect them to the home page
			req.flash('error', 'Sorry, you are\'t allowed to go there :(');
			res.redirect('/');
		}
	}
}

module.exports = isLoggedIn;