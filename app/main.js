const electron = require( 'electron' );
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const ipcMain = electron.ipcMain;
const path = require( 'path' );
const env = require( './lib/env.js' );

// global variable
var APP_NAME = env.name + ' ' + env.version + ' ' + env.codename;
var INDEX = 'file://' + path.join( __dirname, 'index.html' );

// custom js
var Radioit = require( './lib/radioit.js' );
Radioit.boot();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

var shouldQuit = app.makeSingleInstance( function ( commandLine, workingDirectory ) {
    // Someone tried to run a second instance, we should focus our window
    if ( mainWindow ) {
        if ( mainWindow.isMinimized() ) {
            mainWindow.restore();
        }
        mainWindow.focus();
    }
    return true;
});

if ( shouldQuit ) {
    app.quit();
    return;
}

// Quit when all windows are closed.
app.on( 'window-all-closed', function () {
  if ( process.platform != 'darwin' ) {
    app.quit();
  }
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

    mainWindow.loadURL( INDEX );
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

ipcMain.on( 'open-dev', function ( event ) {
    event.returnValue = true;
    mainWindow.webContents.openDevTools();
});

ipcMain.on( 'app-quit', function ( event ) {
    event.returnValue = true;
    mainWindow.close();
});

ipcMain.on( 'app-minimize', function ( event ) {
    event.returnValue = true;
    mainWindow.minimize();
});