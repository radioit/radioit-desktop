const electron = require( 'electron' );
const ipcMain = electron.ipcMain;

const settings = require( './settings.js' );
const cache = require( './cache.js' );

const Radioit = ( function () {
    const Radioit = function () {
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
        ipcMain.on( 'load-settings', function ( event, arg ) {
            event.returnValue = settings.load();
        });
        ipcMain.on( 'save-settings', function ( event, arg ) {
            settings.save( arg );
        });

        // cache
        ipcMain.on( 'load-cache', function ( event, arg ) {
            event.returnValue = cache.load();
        });
        ipcMain.on( 'save-cache', function ( event, arg ) {
            cache.save( arg );
        });
    };

    return Radioit;
})();

module.exports = Radioit;