const express = require('express');
const flash = require('connect-flash');
const assign = require('../modules/assign');
const cache = require('../modules/caching');
const readJSON = require('../modules/readJSON');
const sortBy = require('../modules/sortBy');
const City = require('../schemas/city');
const CityRegion = require('../schemas/city-region');
const Neighborhood = require('../schemas/neighborhood');
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


	if (typeof params.cityRegions === 'string'){
		params.cityRegions = Array(params.cityRegions);
	}

	Neighborhood.add(params).then(function(data){
		// resolved
		Neighborhood.updateCache().then(function(){
			req.flash('success', 'Neighborhood Successfully added');
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

		Neighborhood.delete(req.body[Neighborhood.hash]).then(function(){
			// resolved

			Neighborhood.updateCache().then(function(){
				req.flash('success', 'Neighborhood successfully deleted');
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

		if (typeof params.cityRegions === 'string'){
			params.cityRegions = Array(params.cityRegions);
		}

		if (params.cityRegions === undefined){
			params.cityRegions = Array();	
		}

		Neighborhood.update(params, true).then(function(){
			// resolved update

			Neighborhood.updateCache().then(function(){
				// resolved updateCache

				req.flash('success', 'Neighborhood successfully updated');
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