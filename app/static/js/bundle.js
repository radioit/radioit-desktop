(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = [ '$state', '$scope', '$stateParams', 'detail',
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
]
},{}],2:[function(require,module,exports){
module.exports = [ '$state', '$stateParams', '$scope', 'bangumiListRestrict', 'list',
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
]
},{}],3:[function(require,module,exports){
module.exports = [ '$window',
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
]
},{}],4:[function(require,module,exports){
module.exports = function ( $stateProvider ) {
    $stateProvider
        .state( 'catalogue', {
            url: '/catalogue/:catalogueID?catalogueCacheBuster',
            templateUrl: 'static/view/bangumi.list.html',
            resolve: {
                list: function ( $q, $rootScope, $stateParams, bangumiService ) {
                    var deferred = $q.defer();

                    $rootScope.$emit( 'notify', '获取数据中...' );
                    console.log('list start');

                    bangumiService.getList( $stateParams.catalogueID )
                        .then( function ( data ) {
                            console.log( data );
                            $rootScope.$emit( 'notify', '获取成功', 3000 );
                            deferred.resolve( data );
                        },
                        function ( err ) {
                            console.log( err );
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

                    $rootScope.$emit( 'notify', '获取数据中...' );
                    console.log('detail start');

                    bangumiService.getDetail( $stateParams.catalogueID, $stateParams.bangumiID )
                        .then( function ( data ) {
                            console.log( data );
                            $rootScope.$emit( 'notify', '获取成功', 3000 );
                            deferred.resolve( data );
                        },
                        function ( err ) {
                            console.log( err );
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
}
},{}],5:[function(require,module,exports){
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
},{"./BangumiDetailCtrl":1,"./BangumiListCtrl":2,"./bangumiService":3,"./config":4}],6:[function(require,module,exports){
module.exports = [ '$scope', '$state', 'catalogueService', 'bangumiListRestrict',
    function( $scope, $state, catalogueService, bangumiListRestrict ){
        var vm = this;

        $scope.$on( 'CatalogueStateError', function () {
            vm.selectedCatalogue = bangumiListRestrict.revertSelectedCatalogue();
        });

        vm.list = catalogueService.getList();

        vm.switch = function () {
            bangumiListRestrict.setSelectedCatalogue( vm.selectedCatalogue );

            $state.go( 'catalogue', { catalogueID: vm.selectedCatalogue } );
        }
    }
]
},{}],7:[function(require,module,exports){
module.exports = [ '$window',
    function ( $window ){
        this.getList = function () {
            return $window.App.getCatalogueList();
        };
    }
]
},{}],8:[function(require,module,exports){
module.exports = angular.module( 'radioit.catalogue', ['ui.router'] )

.run( function ( $rootScope ) {
    // notify to revert last catalogue if failed to load catalogue
    $rootScope.$on( '$stateChangeError',
        function ( event, toState, toParams, fromState, fromParams, error ) {
            if ( toState.name === 'catalogue' ) {
                console.log( 'failed to load list' );
                $rootScope.$broadcast( 'CatalogueStateError' );
            }
        });
})

.service( 'catalogueService', require( './catalogueService' ) )

.controller( 'CatalogueSwitchCtrl', require( './CatalogueSwitchCtrl' ) )
;
},{"./CatalogueSwitchCtrl":6,"./catalogueService":7}],9:[function(require,module,exports){
var radioit = require( './main' );

radioit.controller( 'AppCtrl',
    [ '$scope', '$window', 'bangumiService',
    function ( $scope, $window, bangumiService ) {
        var vm = this;

        // settings
        // ----------------------------------------------
        vm.config = {
            appName: 'Radioit',
        };

        vm.isLoading = function () {
            return bangumiService.isBusy();
        }

        vm.openUrl = function ( url ) {
            $window.App.openExternelUrl( url );
        };
    }
])
;
},{"./main":11}],10:[function(require,module,exports){
var radioit = require( './main' );

radioit.directive( 'closeButton',
    [ 'appService',
    function ( app ) {
        return function ( scope, el ) {
            el.on( 'click', function () {
                app.quit();
            });
        }
    }]
)

.directive( 'minimizeButton',
    [ 'appService',
    function ( app ) {
        return function ( scope, el ) {
            el.on( 'click', function () {
                app.minimize();
            });
        }
    }]
)
},{"./main":11}],11:[function(require,module,exports){
module.exports = angular.module( 'radioit', [
    'ngMaterial',
    'ui.router',
    'angularLazyImg',
    require( './catalogue' ).name,
    require( './weekday' ).name,
    require( './bangumi' ).name
    ])

.config( function ( $stateProvider, $mdThemingProvider ) {
    $stateProvider
        .state( 'index', {
            url: '/',
            templateUrl: 'static/view/default.html'
        });
})

.run( function ( $rootScope, $mdToast ) {
    // notification
    $rootScope.$on( 'notify', function ( e, text, hideDelay ) {
        text = text || '';
        hideDelay = hideDelay || 0;
        $mdToast.show(
            $mdToast.simple()
                .content( text )
                .position( 'bottom left' )
                .hideDelay( hideDelay )
        );
    });
})

.service( 'bangumiListRestrict',
    [function () {
        var _lastCatalogue = _currentCatalogue = '',
            _lastDay = _currentDay = 'mon';

        this.getSelectedCatalogue = function () {
            return _currentCatalogue;
        };

        this.setSelectedCatalogue = function ( value ) {
            _lastCatalogue = _currentCatalogue;
            _currentCatalogue = value;
        };

        this.getSelectedDay = function () {
            return _currentDay;
        };

        this.setSelectedDay = function ( value ) {
            _lastDay = _currentDay;
            _currentDay = value;
        };

        this.revertSelectedCatalogue = function () {
            _currentCatalogue = _lastCatalogue;
            return _currentCatalogue;
        }

        this.revertSelectedDay = function () {
            _currentDay = _lastDay;
            return _currentDay;
        };
    }
]);

require( './services' );
require( './controllers' );
require( './directives' );
},{"./bangumi":5,"./catalogue":8,"./controllers":9,"./directives":10,"./services":12,"./weekday":13}],12:[function(require,module,exports){
var radioit = require( './main' );

radioit.service( 'appService',
    [ '$window',
    function ( $window ) {
        this.quit = function () {
            $window.App.quit();
        };

        this.minimize = function () {
            $window.App.minimize();
        };

        this.openUrl = function ( url ) {
            $window.App.openExternelUrl( url );
        };
    }
])
;
},{"./main":11}],13:[function(require,module,exports){
module.exports = angular.module( 'radioit.weekday', [] )

.controller( 'WeekdayCtrl',
    [ 'bangumiListRestrict',
    function ( bangumiListRestrict ) {
        var vm = this;

        vm.day = [
            { id: 'mon', name: '星期一' },
            { id: 'tue', name: '星期二' },
            { id: 'wed', name: '星期三' },
            { id: 'thu', name: '星期四' },
            { id: 'fri', name: '星期五' },
            { id: 'sat', name: '星期六' },
            { id: 'sun', name: '星期日' },
            { id: 'irr', name: '不定' }
        ];

        vm.switchDay = function ( day ) {
            bangumiListRestrict.setSelectedDay( day );
        };

        vm.isSelected = function ( day ) {
            return bangumiListRestrict.getSelectedDay() == day;
        };
    }
]);
},{}],14:[function(require,module,exports){
require( './main' )
},{"./main":11}]},{},[14]);
