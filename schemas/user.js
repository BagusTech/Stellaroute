const bycrpt = require('bcrypt-nodejs');
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
	Indices : ['localEmail']
});


// methods ===============
// generateing a hash
User.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = User;