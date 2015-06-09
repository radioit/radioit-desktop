var extend = require( 'extend' );
var env = require( './env.js' );
var Storage = require( './storage.js' );

var CacheManager = function () {
    if ( !( this instanceof CacheManager ) ) {
        return new CacheManager();
    }
    var self = this;

    var cacheStorage = new Storage( env.cachePath );
    var data = extend( true, {}, cacheStorage.getItems() );

    self.set = function ( key, value ) {
        data[key] = value;
    };

    self.get = function ( key ) {
        return extend( true, {}, data[key] );
    };

    self.save = function () {
        cacheStorage.restore( data );
    }
};

module.exports = CacheManager();