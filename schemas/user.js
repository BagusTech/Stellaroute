const Duck = require('../modules/duck');

const User = Duck({
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
		recieveNewsletter: Boolean,
		isAdmin: Boolean
	},
	
	HASH: 'Id',
	HASHType: 'S',
	CacheDuration: 60*60*24, // 24h -- node-cache timing is in seconds, not miliseconds
	//, Indexes : ['localEmail']
});

module.exports = User;