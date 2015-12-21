const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/user')

localLogin = function(passport){

	// requrired for persistent login sessions
	// passport needs ability to serialize and unserialize user out of session

	// used to serialize the user for the session
	passport.serializerUser(function(user, done){
		done(null, user.id)
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done){
		// ~~~~~~~~~~ this needs to be updated to duck syntax ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		User.findById(id, function(err, user){
			done(err, user);
		})
	});

	// Local Signup ===================================================

	// we are using named strategies since we have one for login and one for signup

	// 'local-signup' is teh NAME of the PASSPORT STRATEGY created below, as indicated by the first param
	passport.user('local-signup', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true // allows us to pass back the entire request to the callback
		},
		function(req, email, password, done){

			// User.findOne wont fire unless data is sent back
			process.nextTick(function(){
				// find a user whose email is the same as the forms email
				// we are checking to see if the user already exists

				// ~~~~~~~~~~ this needs to be updated to duck syntax ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				User.findOne({ 'local.email': email }, function(err, user){
					if (err) { return done(err); }

					if (user) {
						return done(null, false, req.flash('signupMessage', 'That email is already taken'));
					} else {
						var newUser = new User();

						newUser.local.email = email;
						newUser.local.password = newUser.generateHash(password);
					}
				})
			})
		}
	))
}

module.exports = localLogin;