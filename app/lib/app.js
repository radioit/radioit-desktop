const electron = require( 'electron' );
const ipcRenderer = electron.ipcRenderer;
const shell = electron.shell;

const inherits = require( 'util' ).inherits;
const EE = require( 'events' ).EventEmitter;
const Promise = require("bluebird");

const provider = require( './provider.js' );
const explorer = require( './explorer.js' );

const App = function () {
    const self = this;
    if ( !( this instanceof App ) ) {
        return new App();
    }
    EE.call( this );

    let timeoutInterval,
        settings,
        cache;

    // bind events' handler
    // ----------------------------------------------
    // ----------------------------------------------

    // init
    settings = ipcRenderer.sendSync( 'load-settings' );
    cache = ipcRenderer.sendSync( 'load-cache' );

    timeoutInterval = settings.timeout.second
        + settings.timeout.minute * 60
        + settings.timeout.hour * 60 * 60;

    localStorage.setItem( 'catalogue', JSON.stringify( cache['catalogue'] || {} ) );
    localStorage.setItem( 'bangumi', JSON.stringify( cache['bangumi'] || {} ) );

    // APIs
    // APIs include types below:
    // * relate to catalogue and bangumi
    // * realte to explorer
    // * relate to setting
    // * relate to cache
    // ----------------------------------------------

    // catalogue and bangumi related APIs
    // ----------------------------------------------
    self.catalogue = {};
    self.catalogue.getList = function () {
        return provider.getCatalogueList();
    };

    self.catalogue.getAsync = function ( catalogueID, forcedRefresh ) {
        let cacheCatalogue;

        self.emit( 'get-catalogue:start', catalogueID );
        cacheCatalogue = JSON.parse( localStorage.getItem( 'catalogue' ) );

        // get from cache first
        if ( !forcedRefresh ) {
            if ( cacheCatalogue[catalogueID]
              && cacheCatalogue[catalogueID].timestamp
              && cacheCatalogue[catalogueID].timestamp + timeoutInterval * 1000 > Date.now() ) {
                // cache is vaild
                return Promise.resolve( cacheCatalogue[catalogueID] );
            }
            else {
                forcedRefresh = true;
            }
        }

        // forced refresh if failed to get cache
        if ( !!forcedRefresh ) {
            return provider.getCatalogueAsync( catalogueID )
                .then( function ( data ) {
                    self.emit(  'get-catalogue:success', catalogueID );

                    cacheCatalogue[catalogueID] = data;
                    localStorage.setItem( 'catalogue', JSON.stringify( cacheCatalogue ) );
                    self.cache.save();

                    return data;
                },
                function ( err ) {
                    self.emit( 'get-catalogue:error', err );
                    throw new Error( err );
                })
                .finally( function () {
                    self.emit( 'get-catalogue:end', catalogueID );
                });
        }
    };

    self.bangumi = {};
    self.bangumi.getAsync = function ( catalogueID, bangumiID, forcedRefresh ) {
        let cacheBangumi;

        self.emit( 'get-bangumi:start', catalogueID, bangumiID );
        cacheBangumi = JSON.parse( localStorage.getItem( 'bangumi' ) ) || {};

        // get from cache first
        if ( !forcedRefresh ) {
            if ( cacheBangumi[catalogueID + ' ' + bangumiID]
              && cacheBangumi[catalogueID + ' ' + bangumiID].timestamp
              && cacheBangumi[catalogueID + ' ' + bangumiID].timestamp + timeoutInterval * 1000 > Date.now() ) {
                // cache is vaild
                return Promise.resolve( cacheBangumi[catalogueID + ' ' + bangumiID] );
            }
            else {
                forcedRefresh = true;
            }
        }

        // forced refresh if failed to get cache
        if ( !!forcedRefresh ) {
            return provider.getBangumiAsync( catalogueID, bangumiID )
                .then( function ( data ) {
                    self.emit( 'get-bangumi:success', catalogueID, bangumiID );

                    cacheBangumi[catalogueID + ' ' + bangumiID] = data;
                    localStorage.setItem( 'bangumi', JSON.stringify( cacheBangumi ) );
                    self.cache.save();

                    return data;
                },
                function ( err ) {
                    self.emit( 'get-bangumi:error', err );
                    throw new Error( err );
                })
                .finally( function () {
                    self.emit( 'get-bangumi:end', catalogueID, bangumiID );
                });
        }
    };

    self.audio = {};
    self.audio.getAsync = function ( catalogueID, url ) {
        self.emit( 'get-audio:start', catalogueID, url );

        return provider.getAudioRealUrlAsync( catalogueID, url )
            .then( function ( data ) {
                self.emit( 'get-audio:success', catalogueID, url );

                return data;
            },
            function ( err ) {
                self.emit( 'get-audio:error', err );
                throw new Error( err );
            })
            .finally( function () {
                self.emit( 'get-audio:end', catalogueID, url );
            });
    };

    // ----------------------------------------------

    // explorer related APIs
    // ----------------------------------------------
    self.explorer = {};
    self.explorer.exploreAsync = function ( url, options ) {
        return explorer.explore( url, options );
    };
    // ----------------------------------------------

    // setting related APIs
    // ----------------------------------------------
    self.settings = {};
    self.settings.load = function () {
        return settings;
    };
    self.settings.save = function ( obj ) {
        // update timeoutInternel
        timeoutInterval = obj.timeout.second
            + obj.timeout.minute * 60
            + obj.timeout.hour * 60 * 60;
        ipcRenderer.send( 'save-settings', obj );
    };
    // ----------------------------------------------

    // cache related APIs
    // ----------------------------------------------
    self.cache = {};
    self.cache.save = function () {
        ipcRenderer.send( 'save-cache', {
            catalogue: JSON.parse( localStorage.getItem( 'catalogue' ) ),
            bangumi: JSON.parse( localStorage.getItem( 'bangumi' ) )
        });
    };
    self.cache.load = function ( key ) {
        return JSON.parse( localStorage.getItem( key ) ) || {};
    };
    // ----------------------------------------------


    // miscellaneous APIs
    // ----------------------------------------------
    self.openUrl = function ( url ) {
        shell.openExternal( url );
    };

    self.openDevTools = function () {
        ipcRenderer.sendSync( 'open-dev' );
    };
    // ----------------------------------------------

    // control APIs
    // ----------------------------------------------
    self.quit = function () {
        ipcRenderer.sendSync( 'app-quit' );
    };

    self.minimize = function () {
        ipcRenderer.sendSync( 'app-minimize' );
    };
    // ----------------------------------------------
};
inherits( App, EE );

module.exports = window.App = App();