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
])

.service( 'appManagerService', require( './app/appManagerService' ) )

.service( 'appConfig',
    [ '$window',
    function ( $window ) {
        ;
    }
])

.service( 'cacheService',
    [ '$window',
    function ( $window ){
        this.cache = function ( json ) {
            ;
        };

        this.save = function () {
            ;
        };
    }
])

.controller( 'AppCtrl',
    [ '$scope', '$window', 'appConfig', 'bangumiService',
    function ( $scope, $window, appConfig, bangumiService ) {
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

require( './directives' );