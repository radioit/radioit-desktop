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