module.exports = [ '$scope', 'settingsService',
    function ( $scope, settingsService ) {
        var vm = this;

        vm.items = settingsService.getSettings();

        vm.save = function () {
            settingsService.saveSettings( vm.items );
        }
    }
]