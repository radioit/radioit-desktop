const electron = require( 'electron' );
const ipcMain = electron.ipcMain;

const settings = require( './settings.js' );
const cache = require( './cache.js' );

var Radioit = ( function () {
    var Radioit = function () {
        this.registerListeners();
    };

    // Singleton
    Radioit.boot = function () {
        if ( !!Radioit.INSTANCE ) {
            throw new Error( 'only allow one instance running at the same time');
        }
        Radioit.INSTANCE = new Radioit();
    };

    Radioit.prototype.registerListeners = function () {
        // setting
        ipcMain.on( 'get-settings', function ( event, arg ) {
            event.returnValue = settings.get();
        });
        ipcMain.on( 'save-settings', function ( event, arg ) {
            settings.save( arg );
        });

        // cache
        ipcMain.on( 'get-cache', function ( event, arg ) {
            event.returnValue = cache.get();
        });
        ipcMain.on( 'save-cache', function ( event, arg ) {
            cache.save( arg );
        });
    };

    return Radioit;
})();

module.exports = Radioit;