module.exports = [ '$window',
    function ( $window ) {
        this.getSettings = function () {
            return $window.App.getSettings();
        };

        this.saveSettings = function ( settings ) {
            $window.App.saveSettings( settings );
        }
    }
]