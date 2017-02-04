function getNested(obj /*, level1, level2, ... levelN*/) {
	const args = Array.prototype.slice.call(arguments, 1);
	const length = args.length;

	for (var i = 0; i < length; i++) {
		if (!obj || !obj.hasOwnProperty(args[i])) {
			return false;
		}
		obj = obj[args[i]];
	}

	return obj;
}

module.exports = getNested;