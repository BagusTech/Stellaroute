const db = require('../config/aws');
const Duck = require('../modules/duck');

var User = new Duck({
	Database: db,
	Table: 'Users',
	Item: {
		Id: String,
		local: {
			email: String,
			password: String
		},
		fb: {
			email: String
		},
		name: {
			first: String,
			last: String
		}
	},
	
	HASH: 'Id',
	HASHType: 'S'
	//, Indexes : ['localEmail']
});

module.exports = User;