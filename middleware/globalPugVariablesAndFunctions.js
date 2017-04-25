const uuid = require('uuid');
const app = require('../app');
const isAuthorized = require('../modules/isAuthorized');
const getNested = require('../modules/getNested');
const sortBy = require('../modules/sortBy');

function globalPugVariablesAndFunctions(req, res, next){
	// res.locals.env is set in app.js
	if(res.locals.env === 'production') {
        res.locals.canonicalUrl = `https://www.${req.headers.host}${req._parsedOriginalUrl.pathname}`;
    }

	res.locals.url = req.originalUrl;
	res.locals.title = 'stellaroute';
	res.locals.description = 'stellaroute: helping you plan spontinaity';
	res.locals.attractionCategories = [
		'Other',
		'Buildings & Scyscrapers',
		'Parks & Public Spaces',
		'Monuments & Sculptures',
		'Piers & Boardwalks',
		'Amusement Parks',
		'Music Venues & Theatres',
		'Local Experience & Culture',
		'Museums',
		'Tours',
		'Food and Drinks',
		'Activity',
		'Nightlife & Entertainment',
		'Market & Bazzar',
		'Area of Significance',
		'Trails & Walkways',
		'Historic Landmark'
	];

	res.locals.tablesList = [
		{title: 'Attractions', value: 'Attractions'},
		{title: 'Neighborhoods', value: 'Neighborhoods'},
		{title: 'City Regions', value: 'CityRegions'},
		{title: 'Cities', value: 'Cities'},
		{title: 'Province Regions', value: 'ProvinceRegions'},
		{title: 'Provinces', value: 'Provinces'},
		{title: 'Country Regions', value: 'CountryRegions'},
		{title: 'Countries', value: 'Countries'},
		{title: 'World Regions', value: 'WorldRegions'},
		{title: 'Continents', value: 'Continents'},
	];

	res.locals.uuid = uuid;
	res.locals.userIsAuthorized = isAuthorized;
	res.locals.sortBy = sortBy;
	res.locals.getNested = getNested;

	res.locals.randomizeArray = function randomizeArray(a, b) { const x = Math.random(); if(x>.5){return 1;}if(x<.5){return -1;}return 0;}
	res.locals.getIcon = function getIcon(icon) {
		const icons = {
			walk: 'fa fa-blind',
			car: 'fa fa-car',
			bicycle: 'fa fa-bicycle',
			bus: 'fa fa-bus',
			subway: 'fa fa-subway',
			train: 'fa fa-train',
			boat: 'fa fa-ship',
			plane: 'fa fa-plane',
			airport: 'fa fa-plane',
			attraction: 'fa fa-university',
			station: 'fa fa-train',
		};

		return icons[icon];
	}	
	
	res.locals.wysiwygHasData = function wysiwygHasData(data) {
		if (!data) {return false;}

		const empytValues = [
			'<p><br></p>',
			'<div><br></div>',
			'<div><p><br></p></div>',
			'<br>',
		]

		return !(empytValues.indexOf(data) > -1)
	}
	res.locals.createValidAttributeFromTitle = function createValidAttributeFromTitle(title) {
		const findInvalidAttributeCharacters = /[^a-z0-9\s]|^[^a-z\s]+/gi;
		const findMultipleSpaces = /\s\s+/g;
		const findAllSpaces = /\s/g;

		return title.replace(findInvalidAttributeCharacters, '')
			.replace(findMultipleSpaces, ' ')
			.trim()
			.replace(findAllSpaces, '-');
	}
	res.locals.getImagePath = function getImagePath(img, size) {
		if (!img) {
			return `/images/no-image--small.svg`;
		} else if (img.indexOf('https') === 0) {
			return img
		}

		const imgPath = img.split('.');
		const imgExtention = imgPath.pop();
		const s3Path = `https://s3-us-west-2.amazonaws.com/stellaroute/`;

		return img.indexOf('http') === 0 ? 'images/no-image.svg' : `${s3Path}${imgPath.join('')}-${size || 'medium'}.${imgExtention}`
	}

	return next();
}

module.exports = globalPugVariablesAndFunctions;