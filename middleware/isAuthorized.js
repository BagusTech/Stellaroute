const isAuthorized = require('../modules/isAuthorized');

function isAuthorizedMiddleware() {
	const args = arguments;

	return (req, res, next) => {
		if(isAuthorized(res.locals.user, args)) {
			next();
		} else {
			req.flash('error', 'Sorry, you are\'t allowed to go there :(');
			res.redirect('/');
		}
	}
}

module.exports = isAuthorizedMiddleware;