const extend = require( 'extend' );
const env = require( './env.js' );
const Storage = require( './storage.js' );

const cacheStorage = new Storage( env.cachePath );

const CacheManager = {
    load: function () {
        return extend( true, {}, cacheStorage.getItems() );
    },

    save: function ( data ) {
        cacheStorage.restore( data );
        cacheStorage.save();
    }
};

module.exports = CacheManager;