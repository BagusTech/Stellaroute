const Duck = require('../modules/duck');

var CountryRegion = Duck({
	Table: 'CountryRegions',
	Item: {
		Id: String,
		name: String,
		country: String
	},
	HASH: 'Id',
	HASHType: 'S'
});

module.exports = CountryRegion;