// All this does is export the cache object
const NodeCache = require( "node-cache" );

var cache = new NodeCache();

module.exports = cache;