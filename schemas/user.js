const db = require('../config/aws');
const duck = require('../modules/duck');

var User =  new duck(db, 'Users', {
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