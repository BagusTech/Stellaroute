const Duck = require('../modules/duck');

const User = Duck({
	Table: 'Users',
	Item: {
		Id: String,
		facebook: String,
		instagram: String,
		recieveNewsletter: Boolean,
		isAdmin: Boolean,
		name: {
			first: String,
			last: String
		},
		local: {
			email: String,
			password: String
		},
	},
	
	HASH: 'Id',
	HASHType: 'S',
	CacheDuration: 60*60*24, // 24h -- node-cache timing is in seconds, not miliseconds
	//, Indexes : ['localEmail']
}, null, false);

module.exports = User;