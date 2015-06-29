module.exports = [ '$scope', 'settingsService',
    function ( $scope, settingsService ) {
        var vm = this;

        var settings = settingsService.getSettings();

        $scope.proxy = settings.proxy;
        $scope.timeout = settings.timeout;
        $scope.about = settings.about;

        vm.save = function () {
            ;
        }
    }
]