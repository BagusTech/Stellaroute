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
		},
		recieveNewsletter: Boolean
	},
	
	HASH: 'Id',
	HASHType: 'S',
	CacheDuration: 1000*60*60*24
	//, Indexes : ['localEmail']
});

module.exports = User;