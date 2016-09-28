const _duck = require('./duck/_duck');

/* ~~~ init ~~~ */
require('./duck/methods')(_duck);
require('./duck/middleware')(_duck);
require('./duck/promises')(_duck);

const Duck = function(schema, items, isReady) {
	return new _duck(schema, items, isReady);
}

module.exports = Duck;
