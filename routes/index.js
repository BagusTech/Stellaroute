const express          = require('express');
const flash            = require('connect-flash');
const isLoggedIn       = require('../middleware/isLoggedIn');
const setFlash         = require('../modules/setFlash');
const passport         = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User             = require('../schemas/user');
const router           = express.Router();

require('../config/passport')(passport);

router.get('/', function(req, res, next){
	res.render('index', {
		title: 'Stellaroute: helping you explore your world your way',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.'
	});
});

// authentication
router.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/profile',
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

module.exports = router;