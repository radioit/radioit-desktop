var radioit = require( './main' );

radioit.directive( 'closeButton',
    [ 'appManagerService',
    function ( appManager ) {
        return function ( scope, el ) {
            el.on( 'click', function () {
                appManager.quit();
            });
        }
    }]
)

.directive( 'minimizeButton',
    [ 'appManagerService',
    function ( appManager ) {
        return function ( scope, el ) {
            el.on( 'click', function () {
                appManager.minimize();
            });
        }
    }]
)