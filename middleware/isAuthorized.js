const isAuthorized = require('../modules/isAuthorized');

function isAuthorizedMiddleware() {
	const args = arguments;

	return (req, res, next) => {
		if(isAuthorized(res.locals.user, args)) {
			next();
		} else if (!req.locals.user) {
			req.flash('error', 'Please log in to continue.');
			res.redirect('/login');
		} else {
			req.flash('error', 'Sorry, you are\'t allowed to go there :(');
			res.redirect('/');
		}
	}
}

module.exports = isAuthorizedMiddleware;