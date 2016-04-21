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
		}, function(){
			// rejected

			req.flash('error', 'Oops, something went wrong. Please try again.')
			res.redirect('/profile');
		});
	} else if (req.body.submit) {
		delete req.body.submit;

		var params = {};

		readJSON(req.body, readJSON, function(item, data){
			assign(params, item, data[item])
		});

		if(params.local.password !== undefined && params.local.password.length > 4){
			params.local.password = User.generateHash(params.local.password) 
		} else { 
			delete params.local.password;
		}

		User.update(params).then(function(){
			// resolved

			req.flash('success', 'User successfully updated')
			res.redirect('/profile')
		}, function(err){
			// rejected

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.')
			res.redirect('/profile')
		});
	} else {
		req.flash('error', 'There was an error, please try again');
		res.redirect('/profile')
	}
});

module.exports = router;