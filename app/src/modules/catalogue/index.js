module.exports = angular.module( 'radioit.catalogue', ['ui.router'] )

.run( function ( $rootScope ) {
    // notify to revert last catalogue if failed to load catalogue
    $rootScope.$on( '$stateChangeError',
        function ( event, toState, toParams, fromState, fromParams, error ) {
            if ( toState.name === 'catalogue' ) {
                console.log( 'failed to load list' );
            }
        });
})

.service( 'catalogueService', require( './catalogueService' ) )

.controller( 'CatalogueSwitchCtrl', require( './catalogueSwitchCtrl' ) )
;