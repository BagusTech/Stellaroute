const db = require('../config/aws');
const duck = require('../modules/duck');

var Continent =  new duck(db, 'Continents', {
	Item: {
		Id: String,
		name: String
	},
	HASH: 'Id',
	HASHType: 'S'
});

module.exports = Continent;