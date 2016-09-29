const express = require('express');
const flash = require('connect-flash');
const assign = require('../modules/assign');
const cache = require('../modules/caching');
const readJSON = require('../modules/readJSON');
const sortBy = require('../modules/sortBy');
const Country = require('../schemas/country');
const CountryRegion = require('../schemas/country-region');
const Province = require('../schemas/province');
const ProvinceRegion = require('../schemas/province-region');
const City = require('../schemas/city');
const router = express.Router();

router.get('/', function(req, res){
	req.flash('info', 'That page doesn\'t exist, but this is a close second!');
	res.redirect('/countries');
});

router.post('/new', function(req, res){
	const redirect = req.body.delete ? req.body.deleteRedirect : req.body.redirect;
	delete req.body.redirect;
	delete req.body.deleteRedirect;

	const params = req.body;
	params.url = params.url || params.name.replace(/ /g, '-').toLowerCase();

	if (typeof params.countryRegions === 'string'){
		params.countryRegions = Array(params.countryRegions);
	}

	ProvinceRegion.add(params).then(function(data){
		// resolved
		ProvinceRegion.updateCache().then(function(){
			req.flash('success', 'Provice Region Successfully added');
			res.redirect(redirect);
		}, function(err){
			console.error(err);
			res.redirect('/countries');
		})
	}, function(err){
		// rejected
		req.flash('error', 'Opps, something when wrong! Please try again.');
		res.redirect('/countries');
	});
});

router.post('/update', function(req, res){
	const redirect = req.body.redirect;
	delete req.body.redirect;

	if (req.body.delete){

		ProvinceRegion.delete(req.body[ProvinceRegion.hash]).then(function(){
			// resolved

			ProvinceRegion.updateCache().then(function(){
				req.flash('success', 'State/Province Region successfully deleted');
				res.redirect(redirect);
			}, function(){
				res.redirect(redirect);
			});
		}, function(err){
			// rejected

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.');
			res.redirect(redirect);
		});
	} else if (req.body.update) {
		delete req.body.update;

		const params = req.body;

		if (typeof params.countryRegions === 'string'){
			params.countryRegions = Array(params.countryRegions);
		}

		if (params.countryRegions === undefined){
			params.countryRegions = Array();	
		}

		ProvinceRegion.update(params, true).then(function(){
			// resolved update

			ProvinceRegion.updateCache().then(function(){
				// resolved updateCache

				req.flash('success', 'World Region successfully updated');
				res.redirect(redirect);
			}, function(){
				// rejected updateCache

				req.flash('error', 'There was a small issue, but the world region was updated');
				res.redirect(redirect);
			});
		}, function(err){
			// rejected update

			console.error(err);
			req.flash('error', 'Oops, something went wrong. Please try again.');
			res.redirect(redirect);
		});
	} else {
		req.flash('error', 'There was an error, please try again');
		res.redirect(redirect);
	}
});

module.exports = router;