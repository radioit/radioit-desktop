var ipc = require( 'ipc' );
var shell = require( 'shell' );
var inherits = require( 'util' ).inherits;
var EE = require( 'events' ).EventEmitter;

var provider = require( './provider.js' );

var App = function () {
    var self = this;
    if ( !( this instanceof App ) ) {
        return new App();
    }
    EE.call( this );

    // APIs
    // APIs include three types:
    // * related to catalogue and bangumi
    // * related to setting
    // * related to cache
    // ----------------------------------------------

    // catalogue and bangumi related APIs
    // ----------------------------------------------
    self.getCatalogueList = function () {
        return provider.getCatalogueList();
    };

    self.getCatalogueAsync = function ( catalogueID, forcedRefresh ) {

        self.emit( 'get-catalogue:start', catalogueID );

        // get from cache first
        if ( !forcedRefresh ) {
            forcedRefresh = true;
        }

        // forced refresh if failed to get cache
        if ( !!forcedRefresh ) {
            return provider.getCatalogueAsync( catalogueID )
                .then( function ( data ) {
                    self.emit(  'get-catalogue:success', catalogueID );
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

    self.getBangumiAsync = function ( catalogueID, bangumiID, forcedRefresh ) {

        self.emit( 'get-bangumi:start', catalogueID, bangumiID );

        // get from cache first
        if ( !forcedRefresh ) {
            forcedRefresh = true;
        }

        // forced refresh if failed to get cache
        if ( !!forcedRefresh ) {
            return provider.getBangumiAsync( catalogueID, bangumiID )
                .then( function ( data ) {
                    self.emit( 'get-bangumi:success', catalogueID, bangumiID );
                    return data;
                },
                function ( err ) {
                    self.emit( 'get-bangumi:error', err );
                    return err;
                })
                .finally( function () {
                    self.emit( 'get-bangumi:end', catalogueID, bangumiID );
                });
        }
    };

    self.getAudioAsync = function ( catalogueID, url ) {};

    // ----------------------------------------------


    // setting related APIs
    // ----------------------------------------------
    // ----------------------------------------------


    // cache related APIs
    // ----------------------------------------------
    
    // ----------------------------------------------


    // miscellaneous APIs
    // ----------------------------------------------
    self.openExternelUrl = function ( url ) {
        shell.openExternal( url );
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

    // bind events' handler
    // ----------------------------------------------
    self.on( 'get-catalogue:end', function ( arg ) {
        // console.log( arg );
    });
    self.on( 'get-catalogue:success', function ( arg ) {
        // console.log( arg );
    });
    // ----------------------------------------------
}
inherits( App, EE );

module.exports = window.App = App();