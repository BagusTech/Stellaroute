/*jshint node:true */
const fs = require('fs');

module.exports = {
	loadOptions: function loadOptions() {
		try {
			const file = fs.readFileSync('.options', 'utf-8');
			const json = JSON.parse(file);
			return json;
		} catch (err) {
			return {};
		}
	}
};
