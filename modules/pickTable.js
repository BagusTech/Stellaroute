const Attraction     = require('../schemas/attraction');
const Guide          = require('../schemas/guide');
const Continent      = require('../schemas/continent');
const WorldRegion    = require('../schemas/world-region');
const Country        = require('../schemas/country');
const CountryRegion  = require('../schemas/country-region');
const Province       = require('../schemas/province');
const ProvinceRegion = require('../schemas/province-region');
const City           = require('../schemas/city');
const CityRegion     = require('../schemas/city-region');
const Neighborhood   = require('../schemas/neighborhood');

function pickTable(table) {
	switch(table) {
		case 'Attractions': {
			return Attraction;
		}
		case 'Guides': {
			return Guide;
		}
		case 'Continents': {
			return Continent;
		}
		case 'WorldRegions': {
			return WorldRegion;
		}
		case 'Countries': {
			return Countrie;
		}
		case 'CountryRegions': {
			return CountryRegion;
		}
		case 'Provinces': {
			return Province;
		}
		case 'ProvinceRegions': {
			return ProvinceRegion;
		}
		case 'Cities': {
			return City;
		}
		case 'CityRegions': {
			return CityRegion;
		}
		case 'Neighborhoods': {
			return Neighborhood;
		}
		default:
			return;
	}
}

module.exports = pickTable;