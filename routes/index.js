const express          = require('express');
const flash            = require('connect-flash');
const passport         = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const setFlash         = require('../modules/setFlash');
const User             = require('../schemas/user');
const router           = express.Router();

require('../config/passport')(passport);	

router.get('/', User.getCached, function(req, res, next){
	// TODO: Make duck.find() = duck.get()
	//console.log(User.findOne('local.email', 'joe@bagusco.com'));
	//process.exit()

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