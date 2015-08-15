module.exports = [ '$scope', '$translate', 'settingsService',
    function ( $scope, $translate, settingsService ) {
        var vm = this;

        vm.items = settingsService.getSettings();

        vm.changeLanguage = function () {
            $translate.use( vm.items.language );
        };

        vm.save = function () {
            settingsService.saveSettings( vm.items );
        }
    }
]