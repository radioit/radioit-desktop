module.exports = [ '$scope', '$sanitize', 'explorerService',
    function ( $scope, $sanitize, explorerService ) {
        var vm = this;

        vm.busy = false;
        vm.url = '';
        vm.filetype = {
            'asx': true,
            'wsx': true,
            'mp3': true,
            'wav': true,
            'm3u8': true
        };
        vm.string = '';

        vm.result = {};

        vm.trustContent = function ( text ) {}

        vm.explore = function () {
            var options;

            if ( !vm.url ) {
                return;
            }

            vm.busy = true;

            options = {
                'filetype': []
            };
            for ( var key in vm.filetype ) {
                vm.filetype[key] && options.filetype.push( key );
            }
            // if ( options.filetype.length === 0 ) {
            //     return;
            // }
            vm.string && ( options.string = vm.string );

            // retrive data
            explorerService.explore( vm.url, options )
                .then( function ( data ) {
                    vm.result.filetype = data.filetype;
                    vm.result.string = data.string;

                }, function ( err ) {
                    console.log( 'explorer Error: ' + err );
                })
                .finally( function () {
                    $scope.$apply( function () {
                        vm.busy = false;
                    });
                })
                .done();
        };
    }
]