var ipc = require( 'ipc' );

var settings = require( './settings.js' );
var cache = require( './cache.js' );

var Radioit = ( function () {
    var Radioit = function () {
        this.registerListeners();
    }

    // Singleton
    Radioit.boot = function () {
        if ( !!Radioit.INSTANCE ) {
            throw new Error( 'only allow one instance running at the same time');
        }
        Radioit.INSTANCE = new Radioit();
    }

    Radioit.prototype.registerListeners = function () {
        // setting
        ipc.on( 'get-setting', function ( event, arg ) {});
        ipc.on( 'set-setting', function ( event, arg ) {});

        // cache
        ipc.on( 'get-cache', function ( event, arg ) {});
        ipc.on( 'set-cache', function ( event, arg ) {});
    };

    return Radioit;
})();

module.exports = Radioit;