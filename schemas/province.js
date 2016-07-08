const Duck = require('../modules/duck');

var Province = Duck({
	Table: 'Provinces',
	Item: {
		Id: String,
		name: String,
		countryRegions: Array
	},
	HASH: 'Id',
	HASHType: 'S'
});

module.exports = Province;