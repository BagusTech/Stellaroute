const express    = require('express');
const flash      = require('connect-flash');
const sortBy     = require('../modules/sortBy');
const pickTable  = require('../modules/pickTable');
const User       = pickTable('Users');
const Country    = pickTable('Countries');
const City       = pickTable('Cities');
const Guide      = pickTable('Guides');
const router     = express.Router();

router.get('/', (req, res, next) => {
	res.redirect(`/${req.user.username || req.user.Id}`);
});

router.post('/update', (req, res) => {
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
		User.updateCache().then(() => {
			// resolved

			res.send('success')
			return;
		}, (err) => {
			// rejected

			console.error(err);
			res.send(err)
			return;
		});
	}, function(err){
		// rejected

		console.error(err);
		res.send(err)
		return;
	});

});

router.post('/delete', (req, res) => {
	User.delete(req.body[User.hash]).then(function(){
		// resolved

		res.send('success');
		return;
	}, function(){
		// rejected

		console.error(err);
		res.send(err);
		return;
	});
});

module.exports = router;