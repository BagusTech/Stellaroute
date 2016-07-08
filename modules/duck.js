const _duck = require('./duck/_duck');

/* ~~~ init ~~~ */
require('./duck/methods')(_duck);
require('./duck/middleware')(_duck);
require('./duck/promises')(_duck);

const Duck = function(schema, isReady, items) {
	return new _duck(schema, isReady, items);
}

module.exports = Duck;
