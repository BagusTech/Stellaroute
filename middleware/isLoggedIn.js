// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    // or if user is going to the home or login page
    if (req.isAuthenticated()){
		return next();
	} else {
		// if they aren't redirect them to the home page
		res.redirect('/');
	}
}

module.exports = isLoggedIn;