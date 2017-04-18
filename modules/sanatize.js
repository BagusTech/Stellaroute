const xss = require('xss');

function santatize(data) {
	if (typeof data === 'string') {
		return xss(data);
	}

	if (typeof data === 'object') {
		for(key in data) {
			data[key] = santatize(data[key]);
		}
	}

	return data;
}

module.exports = santatize;