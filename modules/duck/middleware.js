const db   = require('../../config/db');
const cache = require('../cache');

module.exports = function(_duck){
	_duck.prototype.getCached = function(){
		const Duck = this;
		const table = this.table;
		const cacheDuration = this.cacheDuration;

		return function(req, res, next){
			if(cache.get(table)){
				//console.log(`${table} is still cached`);

				next();
			} else{
				//console.log(`${table} is not cached`);

				Duck.updateCache().then(function(){
					next();

				}, function(err){
						console.error(JSON.stringify(err, null, 2));

						req.flash('error', 'Opps, something when wrong! Please try again.');
						res.redirect('/');
				});
			}
		}
	}
}