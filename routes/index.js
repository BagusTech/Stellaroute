const express          = require('express');
const flash            = require('connect-flash');
const uuid             = require('uuid');
const passport         = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const strategies       = require('../config/passport');
const instagram        = require('../config/instagram');
const isLoggedIn       = require('../middleware/isLoggedIn');
const cache            = require('../modules/cache');
const setFlash         = require('../modules/setFlash');
const sendEmail        = require('../modules/sendEmail');
const User             = require('../schemas/user');
const Continent 	   = require('../schemas/continent');
const Country     	   = require('../schemas/country');
const City       	   = require('../schemas/city');
const Guide     	   = require('../schemas/guide');
const db               = require('../config/db');
const router           = express.Router();

strategies.local(passport);
strategies.instagram(passport);

// home page
router.get('/', (req, res, next) => {
	res.render('index', {
		title: 'Stellaroute: helping you explore your world your way',
		guides: Guide.find('isPublished', true).join('author', User.cached(), 'Id', 'username').items,
	});
});

// terms and privacy
router.get('/privacy-and-terms', (req, res) => {
	res.render('privacy-terms', {
		title: 'Stellaroute\'s Privacy Agreement and Terms of Service',
		description: 'Stellaroute\'s Privacy Agreement and Terms of Service'
	});
});

// about
router.get('/about', (req, res) => {
	res.render('about', {
		title: 'Stellaroute: Learn Everything About Us',
	});
});

// request
router.get('/request', (req, res) => {
	res.render('request', {
		title: 'Stellaroute: Learn Everything About Us',
	});
});

// feedback
router.get('/feedback', (req, res) => {
	res.render('feedback', {
		title: 'Stellaroute: Learn Everything About Us',
	});
});

// splash pages
router.get('/blogger', (req, res) => {
	res.render('splashPages/blogger', {
		title: 'Stellaroute: For all your blogging needs!',
	});
});

router.get('/travel-wishlist', (req, res) => {
	res.render('splashPages/travelWishlist', {
		title: 'Stellaroute: For all your travel needs!',
	});
});

router.get('/experiences', (req, res) => {
	res.render('splashPages/experiences', {
		title: 'Stellaroute: For all your travel needs!',
	});
});

router.get('/weddings', (req, res) => {
	res.render('splashPages/wedding', {
		title: 'Stellaroute: For all your travel needs!',
	});
});

router.get('/wedding', (req, res) => {
	res.redirect('/weddings');
});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
	return;
});

// sign up for newsletter
router.post('/newsletter-signup', (req, res) => {
	const email = req.body['local.email'];
	const user = User.findOne('local.email', email).items;
	const subject = 'Stellaroute: Thanks for Signing up for our Beta!';
	const template = 'betaSignup';

	if(user){
		if(user.recieveNewsletter === true){
			sendEmail(email, subject, template);
			res.send({msg: 'success'});
			return;
		}

		User.update({Id: user.Id, recieveNewsletter: true}).then(() => {
			sendEmail(email, subject, template);
			res.send({msg: 'success'});
		}, function(error){
			res.status(500).send({msg: 'error: ' + error});
		});
		return;
	}

	const newUser = req.body;

	newUser.username = newUser.local.email.split('@').join('-');

	User.add(newUser, true).then(() => {
		sendEmail(email, subject, template);

		User.updateCache().then(function(){
			res.send({msg: 'success'});
		}, function(){
			res.send({msg: 'success'});
		});
	}, function(error){
		res.status(500).send({msg: 'error: ' + error});
	});
});

router.post('/email-capture', (req, res) => {
	const user = req.body;
	const email = user.local.email;
	const oldUser = User.findOne('local.email', email).items;
	const subject = 'Stellaroute: Thanks for Signing up for our Beta!';
	const template = 'betaSignup';

	if(oldUser){
		user.Id = oldUser.Id;
		user.recieveNewsletter = true;

		if(oldUser.roles) {
			oldUser.roles.forEach((role) => {
				if(user.roles.indexOf(role) === -1) {
					user.roles.push(role);
				}
			})
		}

		User.update(user).then(() => {
			sendEmail(email, subject, template);
			sendEmail('marketing@stellaroute.com', `New User Signed up for ${user.roles[0].replace('beta-', '')}`, null, '<h1>This email is just an alert.</h1>');
			res.send({msg: 'success'});
		}, (error) => {
			res.status(500).send({msg: 'error: ' + error});
		});

		return;
	}

	user.username = user.local.email.split('@').join('-');

	User.add(user).then(() => {
		sendEmail(email, subject, template);
		sendEmail('marketing@stellaroute.com', `New User Signed up for ${user.roles[0].replace('beta-', '')}`, null, `<h1>This email is just an alert. Email: ${user.local.email}</h1>`);

		User.updateCache().then(() => {
			res.send({msg: 'success'});
		}, (error) => {
			console.log(error);
			res.status(500).send({msg: 'error: ' + error});
		});

	}, (error) => {
		console.log(JSON.stringify(user, null, 2));
		console.log(error);
		res.status(500).send({msg: 'error: ' + error});
	});
});

// request a location
router.post('/sendEmail', (req, res) => {
	const html = req.body.html;
	const template = req.body.template;
	const toEmail = req.body.toEmail || 'info@stellaroute.com';
	const subject = req.body.subject || 'Request';

	sendEmail(toEmail, subject, template, html);
	res.send({msg: 'success'});
});

// request a location
router.post('/request-location', (req, res) => {
	const toEmail = 'info@stellaroute.com';
	const subject = 'Location Request';
	const html = '<h1>'+ req.body.fromEmail +' Made a Request!</h1><p>'+ req.body.request +'</p>'

	sendEmail(toEmail, subject, null, html);
	res.send({msg: 'success'});
});

// authentication
router.get('/reset-password', (req, res) => {
	res.render('reset-password', {
		title: 'Stellaroute: Password Reset',
	})
});

router.post('/reset-password', (req, res) => {
	const newPassword = 'xxxxxx'.replace(/x/g, (c) => {const r = Math.random()*16|0;return r.toString(16);});
	const userEmail = req.body.email;
	const userToUpdate = User.findOne('local.email', userEmail).items;

	if(!userToUpdate) {
		res.send('success');
	}

	User.update({Id: userToUpdate.Id, local: {password: User.generateHash(newPassword)}}).then(() => {
		const html = `<h1>Your Password Has Been Reset!</h1><p>Your new password is</p><h2>${newPassword}</h2><p>Please log in at <a href="https://stellaroute.com/">Stellaroute</a> with your new password. We advise going into your profile and changing it something else as soon as possible</p>`

		User.updateCache().then(() => {
			sendEmail(userEmail, 'Stellaroute Password Reset', null, html);
			res.send('success');
		});
	}, (err) => {
		console.error(err);
		res.status(500).send(err);
	});
});

router.get('/login', (req, res, next) => {
	if(!req.user) {
		res.render('profile/login', {
			title: 'StellaRoute: Login',
			description: 'Log into your stellaroute account.',
		});
	} else {
		res.redirect(`/${req.user.username || req.user.Id}`)
	}
});

router.get('/profile', (req, res, next) => {
	const user = req.user;

	if (user) {
		res.redirect(`/${user.username || user.Id}`);
	} else {
		req.flash('error', 'Sorry, you need to be logged on to do that :(');
		res.redirect('/');
	}
});

router.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/profile',
	failureRedirect: '/',
	failureFlash: true
}));

router.post('/auth/local', passport.authenticate('local-login', {
	successRedirect: '/profile',
	failureRedirect: '/login',
	failureFlash: true
}));

router.get('/send-magic-link/:email', (req, res, next) => {
	const key = uuid()
	const email = req.params.email;
	const subject = "You're Magic Link to Stellaroute";
	const template = `
		<a href='https://www.stellaroute.com/auth/local-magic-link?email=${email}&key=${key}'>Click Here!</a>
	`;

	cache.set(key, new Date(), 60*10);

	console.log(`/auth/local-magic-link?email=${email}&key=${key}`)
	res.redirect('/login')

	//sendEmail(email, subject, template);
});

router.get('/auth/local-magic-link', passport.authenticate('local-magic-link', {
	successRedirect: '/profile',
	failureRedirect: '/login',
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