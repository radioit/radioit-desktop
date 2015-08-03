module.exports = function ( $stateProvider ) {
    $stateProvider
        .state( 'catalogue', {
            url: '/catalogue/:catalogueID?catalogueCacheBuster',
            templateUrl: 'static/view/bangumi.list.html',
            resolve: {
                list: function ( $q, $rootScope, $stateParams, bangumiService ) {
                    var deferred = $q.defer();

                    $rootScope.$emit( 'notify', 'Loading...' );
                    console.log('list start');

                    bangumiService.getCatalogue( $stateParams.catalogueID )
                        .then( function ( data ) {
                            console.log( data );
                            $rootScope.$emit( 'notify', 'Success', 3000 );
                            deferred.resolve( data );
                        },
                        function ( err ) {
                            console.log( err );
                            $rootScope.$emit( 'notify', 'Failed', 3000 );
                            deferred.reject( err );
                        })
                        .done();

                    return deferred.promise;
                }
            },
            controller: 'BangumiListCtrl',
            controllerAs: 'bangumiList'
        })

        .state( 'catalogue.bangumi', {
            url: '/bangumi/:bangumiID?bangumiCacheBuster',
            templateUrl: 'static/view/bangumi.detail.html',
            resolve: {
                detail: function ( $q, $rootScope, $stateParams, bangumiService ) {
                    var deferred = $q.defer();

                    $rootScope.$emit( 'notify', 'Loading...' );
                    console.log('detail start');

                    bangumiService.getDetail( $stateParams.catalogueID, $stateParams.bangumiID )
                        .then( function ( data ) {
                            console.log( data );
                            $rootScope.$emit( 'notify', 'Success', 3000 );
                            deferred.resolve( data );
                        },
                        function ( err ) {
                            console.log( err );
                            $rootScope.$emit( 'notify', 'Failed', 3000 );
                            deferred.reject( err );
                        })
                        .done();

                    return deferred.promise;
                }
            },
            controller: 'BangumiDetailCtrl',
            controllerAs: 'bangumiDetail'
        });
}