var radioit = require( './main' );

radioit.controller( 'AppCtrl',
    [ '$scope', '$window', 'bangumiService', '$mdDialog',
    function ( $scope, $window, bangumiService, $mdDialog) {
        var vm = this;

        vm.selectedTabName = 'home';

        vm.isLoading = function () {
            return bangumiService.isBusy();
        };

        vm.selectTab = function ( tabName ) {
            vm.selectedTabName = tabName;
        };
    }]
)
;