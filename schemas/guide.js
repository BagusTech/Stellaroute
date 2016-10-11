const Duck = require('../modules/duck');

// Not used anywhere yet
var Attraction = Duck({
	Table: 'Guides',
	Item: {
		Id: String,
		url: String,
		/* continents: Array,
		worldRegions: Array,
		country: Array,
		countryRegions: Array,
		province: Array,
		provinceRegions: Array,
		city: Array,
		cityRegions: Array,
		neighborhoods: Array, */
		names: {
			display: String,
			Alias: Array
		}
	},
	HASH: 'Id',
	HASHType: 'S',
	UniqueBy: ['url']
}, null, false);

module.exports = Attraction;