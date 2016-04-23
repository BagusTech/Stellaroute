const express          = require('express');
const flash            = require('connect-flash');
const passport         = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const setFlash         = require('../modules/setFlash');
const User             = require('../schemas/user');
const Country          = require('../schemas/country');
const router           = express.Router();

require('../config/passport')(passport);	

router.get('/', Country.getCached, function(req, res, next){
	var data = {
		Id: 'cfa01d98-3dc8-41fb-aa7b-e83b63cb8cfb',
		names: {
			official: 'Test Official',
			native: 'Test Native'
		}
	}
	Country.update(data).then(function(i){
		console.log(i);

		//process.exit()
	}, function(err){
		console.log(err);

		//process.exit()
	});
	

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