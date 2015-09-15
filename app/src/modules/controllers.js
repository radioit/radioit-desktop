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