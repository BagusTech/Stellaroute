const instagram = require('../config/instagram');

// route middleware to get the user info
function getUser(req, res, next) {
	if(req.user){
		res.locals.user = req.user;

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
}

module.exports = getUser;