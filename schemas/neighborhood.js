const Duck = require('../modules/duck');

const Neighborhood = Duck({
	Table: 'Neighborhoods',
	Item: {
		Id: String,
		url: String,
		name: String,
		city: String,
		cityRegions: Array,
	},
	HASH: 'Id',
	HASHType: 'S',
	UniqueBy: ['name', 'city']
}, null, false);

module.exports = Neighborhood;