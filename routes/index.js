const express = require('express');
const flash = require('connect-flash');
const setFlash = require('../modules/setFlash');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const guid = require('../modules/guid')
const User = require('../schemas/user')
const router = express.Router();

//var x = require('../config/passport');

//console.log(x.User);

/* passport.use(new FacebookStrategy({
		clientID: 1074524125904668,
		clientSecret: 'ce55350f705a54d0d61aefb0428f3b98',
		callbackURL: 'test.local/login/callback'
	},
	function(accessToken, refreshToken, profile, done){
		User.findOrCreate({ facebookId: profile.id }, function(err, user){
			if (err) { return done (err); }

			done(null, user);
		});
	}
)); */

router.get('/', function(req, res, next){
	res.render('index', {
		title: 'Stellaroute: helping you explore your worls your way',
		description: 'Stellaroute, founded in 2015, is the world\'s formost innovator in travel technologies and services.'
	});
});
/* 
router.get('/review', function(req, res, next){
	res.render('review', {
		title: 'Write a Review - Stellaroute',
		description: 'Write a review to be used in Stellaroute. These reviews will be used to help users all over the world get a better sense of what places they may want to go to based on what people with similar preferences think.'
	});
});

router.post('/login', function(req, res){
	const params = req.body;

	User.find('localEmail', params.localEmail, 1)
	.then(function(data){
		//resolved

		if (data.Count === 0) {
			params.Id = guid();
			User.add(params).then(function(){
				// resolved

				req.flash('success', 'User successfully added!');
				res.redirect('/profile');
			}, function(){
				// rejected

				req.flash('error', 'You must enter an email and a password.');
				res.redirect('/profile');
			});
		} else {
			//rejected

			req.flash('error', 'A user with that email already exists!');
			res.redirect('/profile');
		}
	}, function(err){
		console.error(err);

		req.flash('error', 'Oops, something went wrong. Please try again!');
		res.redirect('/profile');
	})
})

router.get('/login', function(req, res){
	passport.authenticate('facebook', {
		scope:['email', 'user_friends'] //see https://developers.facebook.com/docs/facebook-login/permissions/v2.5 for all available permissions
	})
}); 

router.get('/login/callback', 
	passport.authenticate('facebook', {
		successRedirect : '/profile',
		failureRedirect : '/'
	})
); */

module.exports = router;