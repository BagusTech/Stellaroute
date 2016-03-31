const express = require('express');
const flash = require('connect-flash');
const setFlash = require('../modules/setFlash');
const User = require('../schemas/user');
const router = express.Router();

router.get('/', function(req, res, next){
	User.find().then(function(data){
		res.render('profile/profile', {
			title: 'Welcome [get persons name]',
			description: 'This is [perosn]\'s profile and they like bagus which is something we like too',
			data: data.Items
		})
	}, function(err){
		console.error(err);
		res.render('profile/profile', {
			title: 'Welcome [get persons name]',
			description: 'This is [perosn]\'s profile and they like bagus which is something we like too',
			data: []
		})
	})
})

router.get('/:id', function(req, res, next){
	User.find('Id', req.params.id, 1).then(function(data){
		res.render('profile/update', {
			title: 'Update Users Profile',
			description: 'This is used to update a users Profile',
			data: data.Items[0],
			key: User.hash
		})
	}, function(err){
		res.render('profile/update', {
			title: 'Update Users Profile',
			description: 'This is used to update a users Profile',
			data: [],
			key: String()
		})
	})
})

// HTML form cannot pass an actual delete, so using post
router.post('/delete', function(req, res){
	User.delete(req.body[Country.hash]).then(function(){
		// resolved

		req.flash('success', 'Country successfully deleted')
		res.redirect('/coutnries');
	}, function(){
		// rejected

		req.flash('error', 'Oops, something went wrong. Please try again.')
		res.redirect('/coutnries');
	});
})

router.post('/update', function(req, res){
	console.log('body: ' + JSON.stringify(req.body, null, 2))
	User.update(req.body).then(function(){
		// resolved

		req.flash('success', 'User successfully updated')
		res.redirect('./')
	}, function(){
		// rejected

		req.flash('error', 'Oops, something went wrong. Please try again.')
		res.redirect('./')
	})
})

module.exports = router;