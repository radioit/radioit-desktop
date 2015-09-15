var ipc = require( 'ipc' );
var shell = require( 'shell' );
var inherits = require( 'util' ).inherits;
var EE = require( 'events' ).EventEmitter;
var Promise = require("bluebird");

var provider = require( './provider.js' );
var explorer = require( './explorer.js' );

var App = function () {
    var self = this;
    if ( !( this instanceof App ) ) {
        return new App();
    }
    EE.call( this );

    var timeoutInterval,
        settings,
        cache;

    // bind events' handler
    // ----------------------------------------------
    // ----------------------------------------------

    // init
    settings = ipc.sendSync( 'get-settings' );
    cache = ipc.sendSync( 'get-cache' );

    timeoutInterval = settings.timeout.second
        + settings.timeout.minute * 60
        + settings.timeout.hour * 60 * 60;

    localStorage.setItem( 'catalogue', JSON.stringify( cache['catalogue'] || {} ) );
    localStorage.setItem( 'bangumi', JSON.stringify( cache['bangumi'] || {} ) );

    // APIs
    // APIs include three types:
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
        var cacheCatalogue;

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
        var cacheBangumi;

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
    }
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
        ipc.send( 'save-settings', obj );
    };
    // ----------------------------------------------

    // cache related APIs
    // ----------------------------------------------
    self.cache = {};
    self.cache.save = function () {
        ipc.send( 'save-cache', {
            catalogue: JSON.parse( localStorage.getItem( 'catalogue' ) ),
            bangumi: JSON.parse( localStorage.getItem( 'bangumi' ) )
        });
    };
    self.cache.load = function ( key ) {
        return JSON.parse( localStorage.getItem( key ) ) || {};
    }
    // ----------------------------------------------


    // miscellaneous APIs
    // ----------------------------------------------
    self.openUrl = function ( url ) {
        shell.openExternal( url );
    };

    self.openDevTools = function () {
        ipc.sendSync( 'open-dev' );
    };
    // ----------------------------------------------

    // control APIs
    // ----------------------------------------------
    self.quit = function () {
        ipc.sendSync( 'app-quit' );
    };

    self.minimize = function () {
        ipc.sendSync( 'app-minimize' );
    };
    // ----------------------------------------------
}
inherits( App, EE );

module.exports = window.App = App();