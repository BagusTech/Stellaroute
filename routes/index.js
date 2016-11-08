const express          = require('express');
const flash            = require('connect-flash');
const passport         = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const strategies       = require('../config/passport');
const instagram        = require('../config/instagram');
const setFlash         = require('../modules/setFlash');
const sendEmail        = require('../modules/sendEmail');
const User             = require('../schemas/user');
const Continent 	   = require('../schemas/continent');
const db               = require('../config/db');
const router           = express.Router();

strategies.local(passport);
strategies.instagram(passport);

router.get('/', function(req, res, next){
	
	/*
	City.find().items.forEach(function(item){
		item.names = {};
		item.names.display = item.name;
		delete item.name;

		City.update(item).then(function(){
			console.log('succesfully updated item')
		});

		var params = {
		    TableName: City.table,
		    Key: { // The primary key of the item (a map of attribute name to AttributeValue)

		        Id: { S: item.Id}
		        // more attributes...
		    },
		    AttributeUpdates: { // The attributes to update (map of attribute name to AttributeValueUpdate)

		        name: {
		            Action: 'DELETE', // PUT (replace)
		                           // ADD (adds to number or set)
		                           // DELETE (delete attribute or remove from set)
		        },
		        // more attribute updates: ...
		    },
		};

		db.updateItem(params, function(err, data) {
		    if (err) console.log(err); // an error occurred
		    else console.log('succesfully deleted param'); // successful response
		});
	});
	//*/	

	res.render('index', {
		title: 'Stellaroute: helping you explore your world your way',
		description: 'Stellaroute, founded in 2016, is the world\'s foremost innovator in travel technologies and services.',
	});
});

// terms and privacy
router.get('/privacy-and-terms', function(req, res){
	res.render('privacy-terms', {
		title: 'Stellaroute\'s Privacy Agreement and Terms of Service',
		description: 'Stellaroute\'s Privacy Agreement and Terms of Service'
	});
});

// about
router.get('/about', function(req, res){
	res.render('about', {
		title: 'Stellaroute: Learn Everything About Us',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.'
	});
});

// request
router.get('/request', function(req, res){
	res.render('request', {
		title: 'Stellaroute: Learn Everything About Us',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.'
	});
});

// feedback
router.get('/feedback', function(req, res){
	res.render('feedback', {
		title: 'Stellaroute: Learn Everything About Us',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.'
	});
});

// explore
router.get('/explore', function(req, res){
	res.render('explore', {
		title: 'Stellaroute: Learn Everything About Us',
		description: 'Stellaroute, founded in 2015, is the world\'s foremost innovator in travel technologies and services.',
		continents: Continent.cached(),
	});
});

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
	return;
});

// sign up for newsletter
router.post('/newsletter-signup', User.getCached(), function(req, res){
	const email = req.body['local.email'];
	const user = User.findOne('local.email', email).items;
	const subject = 'Stellaroute: Thanks for Signing up for our Beta!';
	const template = 'betaSignup';

	if(user){
		if(user.recieveNewsletter === true){
			res.send({msg: 'success'});
			return;
		}

		User.update({Id: user.Id, recieveNewsletter: true}).then(function added(){
			sendEmail(email, subject, template);
			res.send({msg: 'success'});
		}, function(error){
			res.send({msg: 'error: ' + error});
		});
		return;
	}

	User.add(req.body).then(function added(){
		sendEmail(email, subject, template);

		User.updateCache().then(function(){
			res.send({msg: 'success'});
		}, function(){
			res.send({msg: 'success'});
		});
	}, function(error){
		res.send({msg: 'error: ' + error});
	});
});

// request a location
router.post('/request-location', function(req, res){
	const toEmail = 'info@stellaroute.com';
	const subject = 'Location Request';
	const html = '<h1>'+ req.body.fromEmail +' Made a Request!</h1><p>'+ req.body.request +'</p>'

	sendEmail(toEmail, subject, null, html);
	res.send({msg: 'success'});
});

// authentication
router.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/profile',
	failureRedirect: '/',
	failureFlash: true
}));

router.post('/auth/local', User.getCached(), passport.authenticate('local-login', {
	successRedirect: '/',
	failureRedirect: '/',
	failureFlash: true
}));

// GET /auth/instagram
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Instagram authentication will involve
//   redirecting the user to instagram.com.  After authorization, Instagram
//   will redirect the user back to this application at /auth/instagram/callback
router.get('/auth/instagram', passport.authenticate('instagram'));

// GET /auth/instagram/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/instagram/callback', passport.authenticate('instagram', {
	successRedirect: '/',
	failureRedirect: '/',
}));

module.exports = router;