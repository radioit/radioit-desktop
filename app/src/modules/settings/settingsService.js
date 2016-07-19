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