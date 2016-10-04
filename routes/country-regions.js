const express = require('express');
const flash = require('connect-flash');
const assign = require('../modules/assign');
const cache = require('../modules/cache');
const readJSON = require('../modules/readJSON');
const sortBy = require('../modules/sortBy');
const Country = require('../schemas/country');
const CountryRegion = require('../schemas/country-region');
const Province = require('../schemas/province');
const router = express.Router();

router.get('/', function(req, res){
	req.flash('info', 'That page doesn\'t exist, but this is a close second!');
	res.redirect('/countries');
	return;
});

router.post('/new', function(req, res){
	const params = req.body;
	params.url = params.url || params['names.display'].replace(/ /g, '-').toLowerCase();
	
	const redirect = params.redirect;
	delete params.redirect;

	CountryRegion.add(params).then(function(data){
		// resolved
		CountryRegion.updateCache().then(function(){
			req.flash('success', 'World Region Successfully added');
			res.redirect(redirect);
			return;
		}, function(err){
			console.error(err);
			res.redirect(redirect);
			return;
		})
	}, function(err){
		// rejected
		req.flash('error', 'Opps, something when wrong! Please try again.');
		res.redirect(redirect);
		return;
	});
});

router.post('/update', function(req, res){
	const redirect = req.body.delete ? req.body.deleteRedirect : req.body.redirect;
	delete req.body.redirect;
	delete req.body.deleteRedirect;

	if (req.body.delete){

		CountryRegion.delete(req.body[CountryRegion.hash]).then(function(){
			// resolved

			CountryRegion.updateCache().then(function(){
				req.flash('success', 'World Region successfully deleted');
				res.redirect(redirect);
				return;
			}, function(){
				res.redirect(redirect);
				return;
			});
		}, function(err){
			// rejected

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.');
			res.redirect(redirect);
			return;
		});
	} else if (req.body.update) {
		delete req.body.update;

		const params = req.body;

		CountryRegion.update(params, true).then(function(){
			// resolved update

			CountryRegion.updateCache().then(function(){
				// resolved updateCache

				req.flash('success', 'Country Region successfully updated');
				res.redirect(redirect);
				return;
			}, function(){
				// rejected updateCache

				res.redirect(redirect);
				return;
			});
		}, function(err){
			// rejected update

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.');
			res.redirect(redirect);
			return;
		});
	} else {
		req.flash('error', 'There was an error, please try again');
		res.redirect(redirect);
		return;
	}
});

module.exports = router;