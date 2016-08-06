const db   = require('../../config/db');
const cache = require('../caching');

module.exports = function(_duck){
	_duck.prototype.getCached = function(){
		const table = this.table;
		const cacheDuration = this.cacheDuration;

		return function(req, res, next){
			if(cache.get(table)){
				console.log('still cached!');
				next();
			} else{
				db.lite.scan({TableName: table}, function(err, data){
					if (err) {
						console.error(JSON.stringify(err, null, 2));

						req.flash('error', 'Opps, something when wrong! Please try again.');
						res.redirect('/');
					} else {
						cache.set(table, data.Items, cacheDuration);

						next();
					}
				});
			}
		}
	}
}