function isAuthorized(user) {
	const args = Array.prototype.slice.call(arguments, 1);

	if(!user || !user.roles) {
		return false;
	}

	if (user.isAdmin) {
		return true;
	}

	while (args.length) {
		if (user.roles.indexOf(args.shift()) > -1) {
			return true
		}
	}

	return false;
}

module.exports = isAuthorized;