function globalPugVariablesAndFunctions(req, res, next){
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

	res.locals.uuid = function uuid() {return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => { const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);return v.toString(16);})}
	res.locals.randomizeArray = function randomizeArray(a, b) { const x = Math.random(); if(x>.5){return 1;}if(x<.5){return -1;}return 0;}
	res.locals.sortByOrder = function sortByOrder(a, b) {const aOrder = parseInt(a.order, 10), bOrder = parseInt(b.order, 10); if(aOrder > bOrder){return 1} if(aOrder < bOrder){return -1} return 0; }
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
	res.locals.userIsAuthorized = function userIsAuthorized() {if(!res.locals.user){return false;}return res.locals.user.isAdmin;}
	res.locals.getNested = function getNested(obj /*, level1, level2, ... levelN*/) {
		const args = Array.prototype.slice.call(arguments, 1);
		const length = args.length;

		for (var i = 0; i < length; i++) {
			if (!obj || !obj.hasOwnProperty(args[i])) {
				return false;
			}
			obj = obj[args[i]];
		}

		return obj;
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
			return null;
		} else if (img.indexOf('https') === 0) {
			return img
		}

		const imgPath = img.split('.');
		const imgExtention = imgPath.pop();
		const s3Path = 'https://s3-us-west-2.amazonaws.com/stellaroute/images/';

		return img.indexOf('http') === 0 ? null : `${s3Path}${imgPath.join('')}-${size}.${imgExtention}`
	}

	return next();
}

module.exports = globalPugVariablesAndFunctions;