const Duck = require('../modules/duck');

// Not used anywhere yet
var URL = Duck({
	Table: 'Urls',
	Item: {
		Id: String,
		url: String,
		location: {
			Id: String,
			type: String,
		}
	},

	HASH: 'Id',
	HASHType: 'S'
});

module.exports = URL;