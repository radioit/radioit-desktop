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
        ipc.on( 'get-settings', function ( event, arg ) {
            event.returnValue = settings.get();
        });
        ipc.on( 'set-settings', function ( event, arg ) {});

        // cache
        ipc.on( 'get-cache', function ( event, arg ) {
            event.returnValue = cache.get();
        });
        ipc.on( 'save-cache', function ( event, arg ) {
            cache.save( arg );
        });
    };

    return Radioit;
})();

module.exports = Radioit;