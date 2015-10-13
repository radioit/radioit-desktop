var app = require( 'app' );  // Module to control application life.
var BrowserWindow = require( 'browser-window' );  // Module to create native browser window.
var ipc = require( 'ipc' );
var path = require( 'path' );
var env = require( './lib/env.js' );

// global variable
var APP_NAME = env.name + ' ' + env.version + ' ' + env.codename;
var INDEX = 'file://' + path.join( __dirname, 'index.html' );

// custom js
var Radioit = require( './lib/radioit.js' );
Radioit.boot();

// Report crashes to our server.
require( 'crash-reporter' ).start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on( 'window-all-closed', function () {
  if ( process.platform != 'darwin' )
    app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on( 'ready', appReady );

function appReady () {

    mainWindow = new BrowserWindow({
        'width': 1028,
        'height': 604,
        'resizable': false,
        'accept-first-mouse': true,
        'title': APP_NAME,
        'show': false,
        'frame': false,
        'transparent': true
    });

    mainWindow.loadUrl( INDEX );
    // mainWindow.openDevTools(); // remove this

    mainWindow.webContents.on( 'did-finish-load', function () {
        mainWindow.show();
        /* Review:
            http://www.dotnet-rocks.com/2015/05/06/when-electrons-window-settitle-keeps-driving-you-crazy/
        */
        mainWindow.setTitle( APP_NAME );
    });

    mainWindow.on( 'closed', function () {
        mainWindow = null;
    });
}

ipc.on( 'open-dev', function ( event ) {
    event.returnValue = true;
    mainWindow.webContents.openDevTools();
});

ipc.on( 'app-quit', function ( event ) {
    event.returnValue = true;
    mainWindow.close();
});

ipc.on( 'app-minimize', function ( event ) {
    event.returnValue = true;
    mainWindow.minimize();
});