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