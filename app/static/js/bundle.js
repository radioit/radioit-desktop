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
        vm.data = angular.merge( {}, $scope.bangumiToBeLoaded, detail );

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

        vm.openDevTools = function () {
            $window.App.openDevTools();
        };
    }]
)
;
},{"./main":20}],10:[function(require,module,exports){
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
},{"./main":20}],11:[function(require,module,exports){
require( './main' )
},{"./main":20}],12:[function(require,module,exports){
module.exports = function () {
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    return function( str ) {
        return String( str ).replace( /[&<>"'\/]/g, function ( s ) {
            return entityMap[s];
        });
    }
};
},{}],13:[function(require,module,exports){
module.exports = [ '$scope', '$sanitize', 'explorerService',
    function ( $scope, $sanitize, explorerService ) {
        var vm = this;

        vm.busy = false;
        vm.url = '';
        vm.filetype = {
            'asx': true,
            'wsx': true,
            'mp3': true,
            'wav': true,
            'm3u8': true
        };
        vm.string = '';

        vm.result = {};

        vm.trustContent = function ( text ) {}

        vm.explore = function () {
            var options;

            if ( !vm.url ) {
                return;
            }

            vm.busy = true;

            options = {
                'filetype': []
            };
            for ( var key in vm.filetype ) {
                vm.filetype[key] && options.filetype.push( key );
            }
            // if ( options.filetype.length === 0 ) {
            //     return;
            // }
            vm.string && ( options.string = vm.string );

            // retrive data
            explorerService.explore( vm.url, options )
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
},{}],14:[function(require,module,exports){
module.exports = [ '$window',
    function ( $window ) {
        this.explore = function ( url, options ) {
            return $window.App.explorer.exploreAsync( url, options );
        }
    }
]
},{}],15:[function(require,module,exports){
module.exports = function () {
    return function( text, className, keyword ) {
        return String( text ).replace( keyword, '<span class="' + className + '">' + keyword + '</span>' );
    }
};
},{}],16:[function(require,module,exports){
module.exports = angular.module( 'radioit.explorer', ['ngSanitize'] )

.service( 'explorerService', require( './explorerService' ) )

.controller( 'ExplorerCtrl', require( './explorerCtrl' ) )

.filter( 'escapeHTML', require( './escapeHTMLFilter' ) )

.filter( 'highlightText', require( './highlightTextFilter' ) )
},{"./escapeHTMLFilter":12,"./explorerCtrl":13,"./explorerService":14,"./highlightTextFilter":15}],17:[function(require,module,exports){
module.exports = function( $translateProvider ) {
    $translateProvider.useSanitizeValueStrategy( 'escape' );
    $translateProvider
        .translations( 'en', require( './i18n/en' ) )
        .translations( 'chs', require( './i18n/chs' ) );
    $translateProvider.preferredLanguage( 'chs' );
}
},{"./i18n/chs":18,"./i18n/en":19}],18:[function(require,module,exports){
module.exports = {
    'mon': '星期一',
    'tue': '星期二',
    'wed': '星期三',
    'thu': '星期四',
    'fri': '星期五',
    'sat': '星期六',
    'sun': '星期日',
    'irr': '不定期',
    'tod': '今天',

    'TAG_HOME_NAME': '主页',
    'TAG_SETTINGS_NAME': '设置',
    'TAG_EXPLORE_NAME': '探索',
    'TAG_FAVORITE_NAME': '偏好',

    'BUTTON_GETAUDIO_TEXT': '点击获取音频地址',
    'BUTTON_SAVE_TEXT': '保存',
    'BUTTON_CHANNEL_TITLE': '选择频道',

    'INPUT_URL_PLACEHOLDER': '网址',
    'INPUT_REGTEXT_PLACEHOLDER': '正则表达式',

    'INPUT_HOUR_LABEL': '时',
    'INPUT_HOUR_ERROR_MIN': '不小于 0',
    'INPUT_HOUR_ERROR_MAX': '不大于 24',
    'INPUT_MINUTE_LABEL': '分',
    'INPUT_MINUTE_ERROR_MIN': '不小于 0',
    'INPUT_MINUTE_ERROR_MAX': '不大于 60',
    'INPUT_SECOND_LABEL': '秒',
    'INPUT_SECOND_ERROR_MIN': '不小于 1',
    'INPUT_SECOND_ERROR_MAX': '不大于 60',

    'SETTING_HEADER_CACHE': '缓存有效期',
    'SETTING_HEADER_LANGUAGE': '语言',
    'SETTING_HEADER_VERSION': '当前版本',
    'SETTING_HEADER_AUTHOR': '作者',

    'TEXT-GoTo': '前往',
    'TEXT-Back': '返回',
    'TEXT-Refresh': '刷新',
    'TEXT-updatedAt': '刷新于',
    'TEXT-New': '新',
    'TEXT-file': '文件',
    'TEXT-Explore': '探索',
    'TEXT-File': '文件',
    'TEXT-Keyword': '关键字',
    'TEXT-TimeoutIn': '有效期',
    'TEXT-Debug': '打开开发者工具'
}
},{}],19:[function(require,module,exports){
module.exports = {
    'mon': 'Monday',
    'tue': 'Tuesday',
    'wed': 'Wednesday',
    'thu': 'Thusday',
    'fri': 'Friday',
    'sat': 'Saturday',
    'sun': 'Sunday',
    'irr': 'Irregular',
    'tod': 'Today',

    'TAG_HOME_NAME': 'Home',
    'TAG_SETTINGS_NAME': 'Settings',
    'TAG_EXPLORE_NAME': 'Explore',
    'TAG_FAVORITE_NAME': 'Favorite',

    'BUTTON_GETAUDIO_TEXT': 'Click to get audio',
    'BUTTON_SAVE_TEXT': 'Save',
    'BUTTON_CHANNEL_TITLE': 'Select Channel',

    'INPUT_URL_PLACEHOLDER': 'URL',
    'INPUT_REGTEXT_PLACEHOLDER': 'RegExp text',

    'INPUT_HOUR_LABEL': 'hour',
    'INPUT_HOUR_ERROR_MIN': 'Less than 0',
    'INPUT_HOUR_ERROR_MAX': 'Larger than 24',
    'INPUT_MINUTE_LABEL': 'minute',
    'INPUT_MINUTE_ERROR_MIN': 'Less than 0',
    'INPUT_MINUTE_ERROR_MAX': 'Larger than 60',
    'INPUT_SECOND_LABEL': 'second',
    'INPUT_SECOND_ERROR_MIN': 'Less than 1',
    'INPUT_SECOND_ERROR_MAX': 'Larger than 60',

    'SETTING_HEADER_CACHE': 'Cache Timeout in',
    'SETTING_HEADER_LANGUAGE': 'Language',
    'SETTING_HEADER_VERSION': 'Version',
    'SETTING_HEADER_AUTHOR': 'Author',

    'TEXT-GoTo': 'Go to',
    'TEXT-Back': 'Back',
    'TEXT-Refresh': 'Refresh',
    'TEXT-updatedAt': 'updated at',
    'TEXT-New': 'New',
    'TEXT-file': 'file',
    'TEXT-Explore': 'Explore',
    'TEXT-File': 'File',
    'TEXT-Keyword': 'Keyword',
    'TEXT-TimeoutIn': 'Timeout in',
    'TEXT-Debug': 'Open Dev Tools'
}
},{}],20:[function(require,module,exports){
module.exports = angular.module( 'radioit', [
    'ngMaterial',
    'ngMessages',
    'ui.router',
    'angularLazyImg',
    'pascalprecht.translate',
    require( './settings' ).name,
    require( './catalogue' ).name,
    require( './weekday' ).name,
    require( './bangumi' ).name,
    require( './explorer' ).name
    ])

.config( function ( $stateProvider ) {
    $stateProvider
        .state( 'index', {
            url: '/',
            templateUrl: 'static/view/default.html'
        });
})

.config( function( $logProvider ) {
    $logProvider.debugEnabled( true );
})

.config( require( './i18n' ) )

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
},{"./bangumi":5,"./catalogue":8,"./controllers":9,"./directives":10,"./explorer":16,"./i18n":17,"./services":21,"./settings":22,"./weekday":25}],21:[function(require,module,exports){
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
},{"./main":20}],22:[function(require,module,exports){
module.exports = angular.module( 'radioit.settings', [] )

.service( 'settingsService', require( './settingsService' ) )

.controller( 'SettingsCtrl', require( './settingsCtrl' ) )
},{"./settingsCtrl":23,"./settingsService":24}],23:[function(require,module,exports){
module.exports = [ '$scope', '$translate', 'settingsService',
    function ( $scope, $translate, settingsService ) {
        var vm = this;

        vm.items = settingsService.loadSettings();

        vm.changeLanguage = function () {
            $translate.use( vm.items.language );
        };

        vm.save = function () {
            settingsService.saveSettings( vm.items );
        }
    }
]
},{}],24:[function(require,module,exports){
module.exports = [ '$window',
    function ( $window ) {
        this.loadSettings = function () {
            return $window.App.settings.load();
        };

        this.saveSettings = function ( settings ) {
            $window.App.settings.save( settings );
        }
    }
]
},{}],25:[function(require,module,exports){
module.exports = angular.module( 'radioit.weekday', [] )

.controller( 'WeekdayCtrl', require( './weekdayCtrl' ) )

.filter( 'isToday', require( './isTodayFilter' ) )
;
},{"./isTodayFilter":26,"./weekdayCtrl":27}],26:[function(require,module,exports){
module.exports = function () {
    return function ( input ) {
        // 0 for sunday
        return input === ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getUTCDay()] ? 'tod': input;
    }
}
},{}],27:[function(require,module,exports){
module.exports = [ 'bangumiListRestrict',
    function ( bangumiListRestrict ) {
        var vm = this;

        vm.day = [
            'mon',
            'tue',
            'wed',
            'thu',
            'fri',
            'sat',
            'sun',
            'irr'
        ];

        vm.switchDay = function ( day ) {
            bangumiListRestrict.setSelectedDay( day );
        };

        vm.isSelected = function ( day ) {
            return bangumiListRestrict.getSelectedDay() === day;
        };

        vm.isDisabled = function () {
            return !bangumiListRestrict.isListShowed();
        };

        // init
        vm.switchDay( ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getUTCDay()] );
    }
]
},{}]},{},[11]);
