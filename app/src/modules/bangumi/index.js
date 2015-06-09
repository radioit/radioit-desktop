module.exports = angular.module( 'radioit.bangumi', ['ui.router'] )

.config( function ( $stateProvider ) {
    $stateProvider
        .state( 'catalogue', {
            url: '/catalogue/:catalogueID?catalogueCacheBuster',
            templateUrl: 'static/view/bangumi.list.html',
            resolve: {
                list: function ( $q, $rootScope, $stateParams, bangumiService ) {
                    var deferred = $q.defer();

                    $rootScope.$emit( 'notify', '获取数据中...' );console.log('list start');

                    bangumiService.getList( $stateParams.catalogueID )
                        .then( function ( data ) {
                            $rootScope.$emit( 'notify', '获取成功', 3000 );
                            deferred.resolve( data );
                        },
                        function ( err ) {
                            $rootScope.$emit( 'notify', '获取失败', 3000 );
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

                    $rootScope.$emit( 'notify', '获取数据中...' );console.log('detail start');

                    bangumiService.getDetail( $stateParams.catalogueID, $stateParams.bangumiID )
                        .then( function ( data ) {
                            $rootScope.$emit( 'notify', '获取成功', 3000 );
                            deferred.resolve( data );
                        },
                        function ( err ) {
                            $rootScope.$emit( 'notify', '获取失败', 3000 );
                            deferred.reject( err );
                        })
                        .done();

                    return deferred.promise;
                }
            },
            controller: 'BangumiDetailCtrl',
            controllerAs: 'bangumiDetail'
        });
} )

.run( function ( $rootScope, bangumiService ) {
    // listen to ui router error
    $rootScope.$on( '$stateChangeError',
        function ( event, toState, toParams, fromState, fromParams, error ) {
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

.service( 'bangumiService',
    [ '$window',
    function ( $window ) {
        var busy = false;

        this.isBusy = function () {
            return busy;
        }

        this.getList = function ( cid ) {
            busy = true;

            return $window.App.getCatalogueAsync( cid )
                .then( function ( data ) {
                    return data;
                },
                function ( err ) {
                    throw new Error(err);
                })
                .finally( function () {
                    busy = false;
                });

        };

        this.getDetail = function ( cid, bid ) {
            busy = true;

            return $window.App.getBangumiAsync( cid, bid )
                .then( function ( data ) {
                    return data;
                },
                function ( err ) {
                    throw new Error(err);
                })
                .finally( function () {
                    busy = false;
                });
        };
    }
])

.controller( 'BangumiListCtrl',
    [ '$state', '$stateParams', '$scope', 'bangumiListRestrict', 'list',
    function ( $state, $stateParams, $scope, bangumiListRestrict, list ) {
        var vm = this;

        vm.data = list;

        $scope.isListShowed = true;
        $scope.lastBangumiID = '';

        vm.isListShowed = function () {
            return $scope.isListShowed;
        };

        vm.isSelectedDay = function ( day ) {
            return bangumiListRestrict.getSelectedDay() == day;
        }

        vm.isNew = function ( bangumi ) {
            return bangumi.status == 'new';
        }

        vm.loadDetails = function ( bangumi ) {
            // skip request new bangumi if loaded
            if ( $scope.lastBangumiID === bangumi.id ) {
                $scope.isListShowed = false;
                return;
            }

            // copy bangumi info to scope in order to pass it to child controller
            $scope.bangumiToBeLoaded = angular.merge( {}, bangumi );

            $state.go( 'catalogue.bangumi', { bangumiID: bangumi.id } );
        }

        vm.reload = function () {
            var params = angular.copy( $stateParams );
            params.catalogueCacheBuster = Math.random();

            $state.transitionTo( $state.current, params, { reload: false, inherit: true, notify: false } );
        };
    }
])

.controller( 'BangumiDetailCtrl',
    [ '$state', '$scope', '$stateParams', 'detail',
    function ( $state, $scope, $stateParams, detail ) {
        var vm = this;

        $scope.$parent.isListShowed = false;
        $scope.$parent.lastBangumiID = $stateParams.bangumiID;

        vm.isListShowed = function () {
            return $scope.$parent.isListShowed;
        };

        vm.goBack = function () {
            $scope.$parent.isListShowed = true;
        };

        vm.reload = function () {
            var params = angular.copy( $stateParams );
            params.bangumiCacheBuster = Math.random();

            $state.transitionTo( $state.current, params, { reload: false, inherit: true, notify: false } );
        };

        vm.data = angular.merge( detail, $scope.bangumiToBeLoaded );
    }
]);