const Duck = require('../modules/duck');

const Neighborhood = Duck({
	Table: 'Neighborhoods',
	Item: {
		Id: String,
		url: String,
		overveiw: String,
		city: String,
		cityRegions: Array,
		names: {
			display: String,
			official: String,
			native: [{  
				name: String, 
				language: String,
			}],
			alias: Array, 
		},
	},
	HASH: 'Id',
	HASHType: 'S',
	UniqueBy: ['url', 'city']
}, null, false);

module.exports = Neighborhood;