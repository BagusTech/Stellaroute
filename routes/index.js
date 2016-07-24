const express          = require('express');
const flash            = require('connect-flash');
const passport         = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const setFlash         = require('../modules/setFlash');
const User             = require('../schemas/user');
const router           = express.Router();

require('../config/passport')(passport);

router.get('/', function(req, res, next){
	res.render('index', {
		title: 'Stellaroute: helping you explore your world your way',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.'
	});
});

// sign up for newsletter
router.post('/newsletter-signup', User.getCached(), function(req, res, next){
	var user = User.findOne('local.email', req.body['local.email']);

	if(user){
		if(user.recieveNewsletter === true){
			res.send({msg: 'success'});
			return;
		}

		User.update({Id: user.Id, recieveNewsletter: true}).then(function added(){
			res.send({msg: 'success'});
		}, function(error){
			res.send({msg: 'error: ' + error});
		});
		return;
	}

	User.add(req.body).then(function added(){
		res.send({msg: 'success'});
	}, function(error){
		res.send({msg: 'error: ' + error});
	});
})

// authentication
router.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/profile',
	failureRedirect: '/',
	failureFlash: true
}));

router.post('/login', User.getCached(), passport.authenticate('local-login', {
	successRedirect: '/',
	failureRedirect: '/',
	failureFlash: true
}));

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

module.exports = router;