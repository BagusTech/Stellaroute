const Duck = require('../modules/duck');

var Continent = Duck({
	Table: 'Continents',
	Item: {
		Id: String,
		name: String
	},
	HASH: 'Id',
	HASHType: 'S'
});

module.exports = Continent;