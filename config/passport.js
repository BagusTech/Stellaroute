const LocalStrategy = require('passport-local').Strategy;
const User          = require('../schemas/user')
const uuid = require('uuid');



module.exports = function(passport){
	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
	// requrired for persistent login sessions
	// passport needs ability to serialize and unserialize user out of session

	// used to serialize the user for the session
	passport.serializeUser(function(user, done){
		done(null, user.Id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done){
		User.find('Id', id).then(function(user){
			done(null, user);
		}, function(err){
			console.error(err);
			done(err);
		});
	});

	// Local Signup ===================================================

	// we are using named strategies since we have one for login and one for signup

	// 'local-signup' is the NAME of the PASSPORT STRATEGY created below, as indicated by the first param
	passport.use('local-signup', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true // allows us to pass back the entire request to the callback
		}, function(req, email, password, done){

			// User.findOne wont fire unless data is sent back
			process.nextTick(function(){
				// find a user whose email is the same as the forms email
				// we are checking to see if the user already exists

				// ~~~~~~~~~~ this needs to be updated to duck syntax ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				User.find('local.email', email, 1).then(function(user){

					if (user.Items.length) {
						return done(null, false, req.flash('signupMessage', 'That email is already taken'));
					} else {
						const newUser = { Id: uuid.v4(), 
										  local: {
										        email: email, 
											    password: User.generateHash(password)
										    }
									    }

						User.add(newUser).then(function(user){
							done(null, newUser);
						}, function(err){
							console.error(err);
							throw err
						});
					}
				}, function(err){
					console.error(err);
					return done(err);
				})
			})
		}
	));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, email, password, done){
		User.find('local.email', email).then(function(user){
			console.log(JSON.stringify(user, null, 2));

			if(user.Count === 0 || !User.validPassword(password, user.Items[0].local.password)){
				return done(null, false, req.flash('error', 'Sorry, the password and email did not match!'))
			}

			return done(null, user.Items[0]);
		}, function(err){
			console.error(err);
			done(err);
		});
	}));
}