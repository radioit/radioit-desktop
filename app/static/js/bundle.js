(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = [ '$state', '$scope', '$rootScope', '$stateParams', 'bangumiService', 'bangumiListRestrict', 'detail',
    function ( $state, $scope, $rootScope, $stateParams, bangumiService, bangumiListRestrict, detail ) {
        var vm = this;

        // $scope.$parent === bangumiList
        $scope.$parent.lastBangumiID = $stateParams.bangumiID;

        vm.isShowed = function () {
            return !bangumiListRestrict.isListShowed();
        };

        vm.goBack = function () {
            bangumiListRestrict.showList();
        };

        vm.reload = function () {
            var params = angular.copy( $stateParams );
            params.bangumiCacheBuster = Math.random();

            $state.transitionTo( $state.current, params, { reload: false, inherit: true, notify: false } );
        };

        vm.getAudio = function () {
            $rootScope.$emit( 'notify', 'Loading...' );
            bangumiService.getAudio(
                    bangumiListRestrict.getSelectedCatalogue(),
                    vm.data.audio )
                .then( function ( data ) {
                    vm.audio = data;
                    $rootScope.$emit( 'notify', 'Success', 3000 );
                }, function ( err ) {
                    $rootScope.$emit( 'notify', 'Failed', 3000 );
                })
                .done();
        };

        // merge data from parent and ajax
        // $scope.bangumiToBeLoaded is from $scope.$parent
        vm.data = angular.merge( detail, $scope.bangumiToBeLoaded );

        bangumiListRestrict.hideList();
    }
]
},{}],2:[function(require,module,exports){
module.exports = [ '$state', '$stateParams', '$scope', 'bangumiListRestrict', 'list',
    function ( $state, $stateParams, $scope, bangumiListRestrict, list ) {
        var vm = this;

        vm.data = list;

        $scope.lastBangumiID = '';

        vm.isShowed = function () {
            return bangumiListRestrict.isListShowed();
        };

        vm.isSelectedDay = function ( day ) {
            return bangumiListRestrict.getSelectedDay() == day;
        }

        vm.isNew = function ( bangumi ) {
            return bangumi.status == 'new';
        }

        vm.loadDetails = function ( bangumi ) {
            // skip requesting new bangumi if loaded
            if ( $scope.lastBangumiID === bangumi.id ) {
                bangumiListRestrict.hideList();
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

        this.getCatalogue = function ( cid ) {
            busy = true;

            return $window.App.catalogue.getAsync( cid )
                .then( function ( data ) {
                    return data;
                },
                function ( err ) {
                    throw new Error( err );
                })
                .finally( function () {
                    busy = false;
                });

        };

        this.getDetail = function ( cid, bid ) {
            busy = true;

            return $window.App.bangumi.getAsync( cid, bid )
                .then( function ( data ) {
                    return data;
                },
                function ( err ) {
                    throw new Error( err );
                })
                .finally( function () {
                    busy = false;
                });
        };

        this.getAudio = function ( cid, url ) {
            busy = true;

            return $window.App.audio.getAsync( cid, url )
                .then( function ( data ) {
                    return data;
                }, function ( err ) {
                    throw new Error( err );
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
},{}],5:[function(require,module,exports){
module.exports = angular.module( 'radioit.bangumi', ['ui.router'] )

.config( require( './config' ) )

.run( function ( $rootScope, bangumiService ) {
    // listen to ui router error
    $rootScope.$on( '$stateChangeError',
        function ( event, toState, toParams, fromState, fromParams, error ) {
            event.preventDefault();

            if ( toState.name === 'catalogue.bangumi' ) {
                console.log( 'failed to load detail' );
            }
        });

    $rootScope.$on( '$stateChangeStart',
        function( event, toState, toParams, fromState, fromParams ){
            if ( bangumiService.isBusy() ) {
                event.preventDefault();
                $rootScope.$emit( 'notify', 'Please wait for last loading...' );
            }
        });
})

.service( 'bangumiService', require( './bangumiService' ) )

.controller( 'BangumiListCtrl', require( './bangumiListCtrl' ) )

.controller( 'BangumiDetailCtrl', require( './bangumiDetailCtrl' ) );
},{"./bangumiDetailCtrl":1,"./bangumiListCtrl":2,"./bangumiService":3,"./config":4}],6:[function(require,module,exports){
module.exports = [ '$window',
    function ( $window ){
        this.getList = function () {
            return $window.App.catalogue.getList();
        };
    }
]
},{}],7:[function(require,module,exports){
module.exports = [ '$scope', '$state', 'catalogueService', 'bangumiListRestrict',
    function( $scope, $state, catalogueService, bangumiListRestrict ){
        var vm = this;

        vm.list = catalogueService.getList();

        vm.switch = function ( id ) {
            bangumiListRestrict.setSelectedCatalogue( id );

            $state.go( 'catalogue', { catalogueID: id } );
        }

        vm.isDisabled = function () {
            return !bangumiListRestrict.isListShowed();
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
            }
        });
})

.service( 'catalogueService', require( './catalogueService' ) )

.controller( 'CatalogueSwitchCtrl', require( './catalogueSwitchCtrl' ) )
;
},{"./catalogueService":6,"./catalogueSwitchCtrl":7}],9:[function(require,module,exports){
var radioit = require( './main' );

radioit.controller( 'AppCtrl',
    [ '$scope', '$window', 'bangumiService', '$mdDialog',
    function ( $scope, $window, bangumiService, $mdDialog) {
        var vm = this;

        vm.selectedTabName = 'home';

        vm.selectTab = function ( tabName ) {
            vm.selectedTabName = tabName;
        };

        vm.openUrl = function ( url ) {
            $window.App.openUrl( url );
        };
    }]
)
;
},{"./main":15}],10:[function(require,module,exports){
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
;
},{"./main":15}],11:[function(require,module,exports){
require( './main' )
},{"./main":15}],12:[function(require,module,exports){
module.exports = [ '$scope', 'explorerService',
    function ( $scope, explorerService ) {
        var vm = this;

        vm.busy = false;
        vm.url = 'http://hibiki-radio.jp/description/momor';
        vm.filetype = {
            'asx': true,
            'wsx': true,
            'mp3': true,
            'wav': true,
            'm3u8': true
        };
        vm.result = {};

        vm.explore = function () {
            var filetype = [];
            vm.busy = true;

            for ( var key in vm.filetype ) {
                vm.filetype[key] && filetype.push( key );
            }
            if ( filetype.length === 0 ) {
                return;
            }

            explorerService.explore( vm.url, { 'filetype': filetype } )
                .then( function ( data ) {
                    vm.result.filetype = data.filetype;
                    vm.result.string = data.string;
                }, function ( err ) {
                    console.log( 'explorer Error: ' + err );
                })
                .finally( function () {
                    $scope.$apply( function () {
                        vm.busy = false;
                    });
                })
                .done();
        };
    }
]
},{}],13:[function(require,module,exports){
module.exports = [ '$window',
    function ( $window ) {
        this.explore = function ( url, options ) {
            return $window.App.explorer.exploreAsync( url, options );
        }
    }
]
},{}],14:[function(require,module,exports){
module.exports = angular.module( 'radioit.explorer', [] )

.service( 'explorerService', require( './explorerService' ) )

.controller( 'ExplorerCtrl', require( './explorerCtrl' ) )
},{"./explorerCtrl":12,"./explorerService":13}],15:[function(require,module,exports){
module.exports = angular.module( 'radioit', [
    'ngMaterial',
    'ngMessages',
    'ui.router',
    'angularLazyImg',
    require( './settings' ).name,
    require( './catalogue' ).name,
    require( './weekday' ).name,
    require( './bangumi' ).name,
    require( './explorer' ).name
    ])

.config( function ( $stateProvider, $mdThemingProvider ) {
    $stateProvider
        .state( 'index', {
            url: '/',
            templateUrl: 'static/view/default.html'
        });
})

.config( function( $logProvider ) {
    $logProvider.debugEnabled( true );
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
;

require( './services' );
require( './controllers' );
require( './directives' );
},{"./bangumi":5,"./catalogue":8,"./controllers":9,"./directives":10,"./explorer":14,"./services":16,"./settings":17,"./weekday":20}],16:[function(require,module,exports){
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
    }]
)

.service( 'bangumiListRestrict',
    [function () {
        var _currentCatalogue = '',
            _currentDay = 'mon',
            _isListShowed = true;

        this.getSelectedCatalogue = function () {
            return _currentCatalogue;
        };

        this.setSelectedCatalogue = function ( value ) {
            _currentCatalogue = value;
        };

        this.getSelectedDay = function () {
            return _currentDay;
        };

        this.setSelectedDay = function ( value ) {
            _currentDay = value;
        };

        this.isListShowed = function () {
            return _isListShowed;
        };

        this.showList = function () {
            _isListShowed = true;
        };

        this.hideList = function () {
            _isListShowed = false;
        };
    }
])
;
},{"./main":15}],17:[function(require,module,exports){
module.exports = angular.module( 'radioit.settings', [] )

.service( 'settingsService', require( './settingsService' ) )

.controller( 'SettingsCtrl', require( './settingsCtrl' ) )
},{"./settingsCtrl":18,"./settingsService":19}],18:[function(require,module,exports){
module.exports = [ '$scope', 'settingsService',
    function ( $scope, settingsService ) {
        var vm = this;

        vm.items = settingsService.getSettings();

        vm.save = function () {
            settingsService.saveSettings( vm.items );
        }
    }
]
},{}],19:[function(require,module,exports){
module.exports = [ '$window',
    function ( $window ) {
        this.getSettings = function () {
            return $window.App.settings.load();
        };

        this.saveSettings = function ( settings ) {
            $window.App.settings.save( settings );
        }
    }
]
},{}],20:[function(require,module,exports){
module.exports = angular.module( 'radioit.weekday', [] )

.controller( 'WeekdayCtrl', require( './weekdayCtrl' ) )
;
},{"./weekdayCtrl":21}],21:[function(require,module,exports){
module.exports = [ 'bangumiListRestrict',
    function ( bangumiListRestrict ) {
        var vm = this;

        vm.day = [
            { id: 'mon', name: 'monday' },
            { id: 'tue', name: 'tuesday' },
            { id: 'wed', name: 'wednesday' },
            { id: 'thu', name: 'thusday' },
            { id: 'fri', name: 'friday' },
            { id: 'sat', name: 'saturday' },
            { id: 'sun', name: 'sunday' },
            { id: 'irr', name: 'irr' }
        ];

        vm.switchDay = function ( day ) {
            bangumiListRestrict.setSelectedDay( day );
        };

        vm.isSelected = function ( day ) {
            return bangumiListRestrict.getSelectedDay() == day;
        };

        vm.isDisabled = function () {
            return !bangumiListRestrict.isListShowed();
        };
    }
]
},{}]},{},[11]);
