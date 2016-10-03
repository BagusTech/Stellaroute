const Duck = require('../modules/duck');

const Continent = Duck({
	Table: 'Continents',
	Item: {
		Id: String,
		url: String,
		name: String
	},
	HASH: 'Id',
	HASHType: 'S',
	UniqueBy: ['url']
}, null, false);

module.exports = Continent;