module.exports = [ '$window',
    function ( $window ) {
        this.getSettings = function () {
            return $window.App.getSettings();
        };
    }
]