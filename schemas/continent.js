const Duck = require('../modules/duck');

const Continent = Duck({
	Table: 'Continents',
	Item: {
		Id: String,
		url: String,
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
	UniqueBy: ['url']
}, null, false);

module.exports = Continent;