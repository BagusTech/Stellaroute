const db = require('../config/aws');
const duck = require('../modules/duck');

// Not used anywhere yet
var Attraction =  new duck(db, 'Attractions', {
	Item: {
		Id: String
	},

	HASH: 'Id',
	HASHType: 'S'
	//, Indexes : ['localEmail']
});

module.exports = Attraction;