var extend = require( 'extend' );
var env = require( './env.js' );
var Storage = require( './storage.js' );

var cacheStorage = new Storage( env.cachePath );

var CacheManager = {
    get: function () {
        return extend( true, {}, cacheStorage.getItems() );
    },

    save: function ( data ) {
        cacheStorage.restore( data );
        cacheStorage.save();
    }
};

module.exports = CacheManager;