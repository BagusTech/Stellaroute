const Duck = require('../modules/duck');

const User = Duck({
	Table: 'Users',
	Item: {
		Id: String,
		username: String,
		facebook: String,
		instagram: String,
		recieveNewsletter: Boolean,
		isAdmin: Boolean,
		roles: Array,
		name: {
			first: String,
			last: String,
		},
		local: {
			email: String,
			password: String,
		},
		gender: String,
		profilePicture: String,
		bannerImage: String,
		friends: Array,
		created: Date,
		favorites: Array,
		following: Array,
		tagline: String,
		description: String,
		isDeleted: Boolean,
		isNewUser: Boolean,
		featuredGuides: Array,
	},
	HASH: 'Id',
	HASHType: 'S',
	CacheDuration: 60*60*24, // 24h -- node-cache timing is in seconds, not miliseconds
	//, Indexes : ['localEmail'],
	UniqueBy: ['username'],
}, null, false);

module.exports = User;