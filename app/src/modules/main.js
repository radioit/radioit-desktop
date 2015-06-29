module.exports = angular.module( 'radioit', [
    'ngMaterial',
    'ngMessages',
    'ui.router',
    'angularLazyImg',
    require( './settings' ).name,
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