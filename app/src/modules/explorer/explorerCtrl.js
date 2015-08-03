module.exports = [ '$scope', 'explorerService',
    function ( $scope, explorerService ) {
        var vm = this;

        vm.busy = false;
        vm.url = 'http://hibiki-radio.jp/description/momor';
        vm.filetype = {
            'asx': true,
            'wsx': true,
            'mp3': true,
            'wav': true,
            'm3u8': true
        };
        vm.stringRe = '';

        vm.result = {};

        vm.explore = function () {
            var filetype = [];
            vm.busy = true;

            for ( var key in vm.filetype ) {
                vm.filetype[key] && filetype.push( key );
            }
            if ( filetype.length === 0 ) {
                return;
            }

            explorerService.explore( vm.url, { 'filetype': filetype, 'string': vm.stringRe } )
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