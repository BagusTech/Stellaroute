const Duck = require('../modules/duck');

// Not used anywhere yet
var Attraction = Duck({
	Table: 'Attractions',
	Item: {
		Id: String
	},

	HASH: 'Id',
	HASHType: 'S'
});

module.exports = Attraction;