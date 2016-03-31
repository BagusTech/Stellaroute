const express = require('express');
const flash = require('connect-flash');
const setFlash = require('../modules/setFlash');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const isLoggedIn = require('../modules/isLoggedIn');
const User = require('../schemas/user');
const router = express.Router();

require('../config/passport')(passport);

router.get('/', function(req, res, next){

	res.render('index', {
		title: 'Stellaroute: helping you explore your world your way',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		user: req.user
	});
});

router.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/',
	failureRedirect: '/',
	failureFlash: true
}));

router.post('/login', passport.authenticate('local-login', {
	successRedirect: '/',
	failureRedirect: '/',
	failureFlash: true
}));

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

/* 
router.get('/review', function(req, res, next){
	res.render('review', {
		title: 'Write a Review - Stellaroute',
		description: 'Write a review to be used in Stellaroute. These reviews will be used to help users all over the world get a better sense of what places they may want to go to based on what people with similar preferences think.'
	});
});

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