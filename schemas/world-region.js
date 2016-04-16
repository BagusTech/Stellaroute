const db = require('../config/aws');
const duck = require('../modules/duck');

var WorldRegion =  new duck(db, 'WorldRegions', {
	Item: {
		Id: String,
		name: String,
		continent: Array
	},
	HASH: 'Id',
	HASHType: 'S'
});

module.exports = WorldRegion;