const Duck = require('../modules/duck');

var User = Duck({
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