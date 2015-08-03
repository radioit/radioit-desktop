module.exports = [ '$window',
    function ( $window ) {
        this.explore = function ( url, options ) {
            return $window.App.explorer.exploreAsync( url, options );
        }
    }
]