const Duck = require('../modules/duck');

// Not used anywhere yet
var Attraction = Duck({
	Table: 'Attractions',
	Item: {
		Id: String
		url: String,
	},

	HASH: 'Id',
	HASHType: 'S'
}, null, false);

module.exports = Attraction;