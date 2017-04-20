const uuid              = require('uuid');
const cache             = require('../modules/cache');
const LocalStrategy     = require('passport-local').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const instagram         = require('./instagram');
const FacebookStrategy  = require('passport-facebook').Strategy;
const facebook         = require('./facebook');
const User              = require('../schemas/user');

const strategies    = {};

strategies.local = function(passport){
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
		var user = User.findOne('Id', id).items;

		if (user){
			done(null, user);
		} else {
			done(null, false);
		}
	});

	// Local Signup ===================================================

	// we are using named strategies since we have one for login and one for signup

	// 'local-signup' is the NAME of the PASSPORT STRATEGY created below, as indicated by the first param
	passport.use('local-signup', new LocalStrategy({
			usernameField: 'local.email',
			passwordField: 'local.password',
			passReqToCallback: true // allows us to pass back the entire request to the callback
		}, function(req, email, password, done){
			if (User.findOne('local.email', email).items) {
				return done(null, false, req.flash('error', 'That email is already taken'));
			} else if (User.findOne('username', req.body.username).items) {
				return done(null, false, req.flash('error', 'That email is already taken'));
			} else if(password.length < 4) {
				return done(null, false, req.flash('error', 'Your Passphrase must be at least 4 characters long.'));
			}

			const newUser = {
				Id: uuid.v4(), 
				local: {
					email: email, 
					password: User.generateHash(password)
				},
				name: {
					first: req.body['name.first'],
					last: req.body['name.last']
				},
				created: new Date(),
			}

			newUser.username = req.body.username || newUser.Id;

			User.add(newUser).then(function(user){
				User.updateCache().then(() => {done(null, newUser);});
			}, function(err){
				console.error(err);
				return done(null, false, req.flash('error', 'Something went wrong, please try again.'));
			});
		}
	));

	passport.use('local-login', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		}, function(req, email, password, done){
			const user = User.findOne('local.email', email).items;

			if(user && User.validPassword(password, user.local.password)){
				return done(null, user);
			}

			return done(null, false, req.flash('error', 'Sorry, the password and email did not match!'));
		}
	));

	passport.use('local-magic-link', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'key',
			passReqToCallback: true
		}, function(req, email, key, done){
			const user = User.findOne('local.email', email).items;
			const isActive = (new Date() - cache.get(key)) < 1000*60*10;

			if(user && isActive){
				return done(null, user);
			}

			return done(null, false, req.flash('error', 'Sorry, the link is expired!'));
		}
	));
};

strategies.instagram = function(passport){
	passport.serializeUser(function(user, done){
		done(null, user.Id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done){
		var user = User.findOne('Id', id).items;

		if (user){
			done(null, user);
		} else {
			done(null, false);
		}
	});

	passport.use(new InstagramStrategy({
		clientID: process.env.INSTAGRAM_ID,
		clientSecret: process.env.INSTAGRAM_SECRET,
		callbackURL: '/auth/instagram/callback'
	},
	function(accessToken, refreshToken, profile, done) {
		instagram.use({ access_token: accessToken });

		process.nextTick(function () {
			const user = User.findOne('instagram', profile.id).items;

			if(!user){
				const newUser = {
					Id: uuid.v4(),
					instagram: profile.id,
					name: {
						first: (profile.name.givenName ? profile.name.givenName : profile.displayName),
					},
				};

				if(profile.name.familyName){
					newUser.name.last = profile.name.familyName
				}

				User.add(newUser, false).then(function success(){
					User.deleteCached();
					return done(null, newUser);
				}, function error(err){
					console.error(err);
					return done(null, false, req.flash('error', 'Something went wrong, please try again.'));
				});
			} else {
				return done(null, user);
			}			
		});
	}));
};

strategies.facebook = function(passport){
	passport.serializeUser(function(user, done){
		done(null, user.Id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done){
		var user = User.findOne('Id', id).items;

		if (user){
			done(null, user);
		} else {
			done(null, false);
		}
	});

	passport.use(new FacebookStrategy({
		clientID: process.env.FACEBOOK_ID,
		clientSecret: process.env.FACEBOOK_SECRET,
		callbackURL: '/auth/facebook/callback',
		profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'gender', 'link', 'public_key', 'picture']
	},
	function(accessToken, refreshToken, profile, done) {
		console.log(profile);
		facebook.options({ access_token: accessToken });

		process.nextTick(function () {
			const user = User.findOne('facebook', profile.id).items || User.findOne('local.email', profile.emails && profile.emails[0] && profile.emails[0].value).items;

			if(!user){
				const newUser = {
					Id: uuid.v4(),
					facebook: profile.id,
					username: profile.displayName.trim().replace(/\W+/g, '-'),
					name: {
						first: profile.name && profile.name.givenName,
						last: profile.name && profile.name.familyName
					},
					local: {
						email: profile.emails && profile.emails[0] && profile.emails[0].value
					},
					gender: profile.gender,
					profilePicture: profile.picture,
				};

				User.add(newUser, false).then(function success(){
					User.deleteCached();
					return done(null, newUser);
				}, function error(err){
					console.error(err);
					return done(null, false, req.flash('error', 'Something went wrong, please try again.'));
				});
			} else if(!user.facebook){
				user.facebook = profile.id;
				user.name.first = user.name.first || profile.name && profile.name.givenName,
				user.name.last = user.name.last || profile.name && profile.name.familyName,
				user.gender = profile.gender;
				user.username = user.username || profile.displayName.trim().replace(/\W+/g, '-');
				user.profilePicture = user.profilePicture || profile.picture;

				User.update(user, false).then(() => {
					User.deleteCached();
					return done(null, user);
				}, (err) => {
					console.error(err);
					return done(null, false, req.flash('error', 'Something went wrong, please try again.'));
				});
			} else {
				return done(null, user);
			}		
		});
	}));
};

module.exports = strategies;