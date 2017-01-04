const express    = require('express');
const flash      = require('connect-flash');
const sortBy     = require('../modules/sortBy');
const User       = require('../schemas/user');
const router     = express.Router();

router.get('/', (req, res, next) => {
	res.render('profile/profile', {
		title: 'StellaRoute: My Profile',
		description: 'This is used to view, edit, and delete my profile',
		key: User.hash,
		users: User.cached().sort()
	});
});

router.post('/update', (req, res) => {
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
	} else if (req.body.update) {
		debugger;
		delete req.body.update;

		const params = req.body;

		if(params['local.password'] && params['local.password'].length > 4){
			params['local.password'] = User.generateHash(params['local.password']);
		} else { 
			delete params['local.password'];
		}

		if(params.isAdmin){
			params.isAdmin = params.isAdmin.indexOf('true') > -1 ? true : false;
		}

		User.update(params, true).then(function(){
			// resolved

			User.updateCache().then(() => {
				req.flash('success', 'User successfully updated');
				res.redirect('/profile');
				return;
			}, (err) => {
				console.error(err);
				req.flash('error', 'Oops, something went wrong. Please try again.');
				res.redirect('/profile');
				return;
			});
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