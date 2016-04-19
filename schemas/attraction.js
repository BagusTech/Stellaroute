const db = require('../config/aws');
const Duck = require('../modules/duck');

// Not used anywhere yet
var Attraction = new Duck({
	Database: db,
	Table: 'Attractions',
	Item: {
		Id: String
	},

	HASH: 'Id',
	HASHType: 'S'
	//, Indexes : ['localEmail']
});

module.exports = Attraction;