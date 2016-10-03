const express    = require('express');
const flash      = require('connect-flash');
const assign     = require('../modules/assign');
const readJSON   = require('../modules/readJSON');
const User       = require('../schemas/user');
const router     = express.Router();

router.get('/', function(req, res, next){
	res.render('profile/profile', {
		title: 'StellaRoute: My Profile',
		description: 'This is used to view, edit, and delete my profile'
	});
});

router.post('/update', function(req, res){
	if (req.body.delete){
		User.delete(req.body[User.hash]).then(function(){
			// resolved

			req.flash('success', 'User successfully deleted')
			res.redirect('/logout');
			return;
		}, function(){
			// rejected

			req.flash('error', 'Oops, something went wrong. Please try again.');
			res.redirect('/profile');
			return;
		});
	} else if (req.body.submit) {
		delete req.body.submit;

		const params = req.body;

		if(params.local.password !== undefined && params.local.password.length > 4){
			params.local.password = User.generateHash(params.local.password);
		} else { 
			delete params.local.password;
		}

		User.update(params, true).then(function(){
			// resolved

			req.flash('success', 'User successfully updated');
			res.redirect('/profile');
			return;
		}, function(err){
			// rejected

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.');
			res.redirect('/profile');
			return;
		});
	} else {
		req.flash('error', 'There was an error, please try again');
		res.redirect('/profile');
		return;
	}
});

module.exports = router;