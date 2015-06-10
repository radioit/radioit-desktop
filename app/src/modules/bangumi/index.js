module.exports = angular.module( 'radioit.bangumi', ['ui.router'] )

.config( require( './config' ) )

.run( function ( $rootScope, bangumiService ) {
    // listen to ui router error
    $rootScope.$on( '$stateChangeError',
        function ( event, toState, toParams, fromState, fromParams, error ) {
            event.preventDefault();
            $rootScope.$emit( 'notify', '载入失败', 3000 );
        });

    $rootScope.$on( '$stateChangeError',
        function ( event, toState, toParams, fromState, fromParams, error ) {
            if ( toState.name === 'catalogue.bangumi' ) {
                console.log( 'failed to load detail' );
            }
        });

    $rootScope.$on( '$stateChangeStart',
        function( event, toState, toParams, fromState, fromParams ){
            if ( bangumiService.isBusy() ) {
                event.preventDefault();
                $rootScope.$emit( 'notify', '等候上一次获取数据的完成...' );
            }
        });
})

.service( 'bangumiService', require( './bangumiService' ) )

.controller( 'BangumiListCtrl', require( './BangumiListCtrl' ) )

.controller( 'BangumiDetailCtrl', require( './BangumiDetailCtrl' ) );