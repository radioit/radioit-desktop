module.exports = [ '$state', '$scope', '$rootScope', '$stateParams', 'bangumiService', 'bangumiListRestrict', 'detail',
    function ( $state, $scope, $rootScope, $stateParams, bangumiService, bangumiListRestrict, detail ) {
        var vm = this;

        // $scope.$parent === bangumiList
        $scope.$parent.lastBangumiID = $stateParams.bangumiID;

        vm.isShowed = function () {
            return !bangumiListRestrict.isListShowed();
        };

        vm.goBack = function () {
            bangumiListRestrict.showList();
        };

        vm.reload = function () {
            var params = angular.copy( $stateParams );
            params.bangumiCacheBuster = Math.random();

            $state.transitionTo( $state.current, params, { reload: false, inherit: true, notify: false } );
        };

        vm.getAudio = function () {
            $rootScope.$emit( 'notify', 'Loading...' );
            bangumiService.getAudio(
                    bangumiListRestrict.getSelectedCatalogue(),
                    vm.data.audio )
                .then( function ( data ) {
                    vm.audio = data;
                    $rootScope.$emit( 'notify', 'Success', 3000 );
                }, function ( err ) {
                    $rootScope.$emit( 'notify', 'Failed', 3000 );
                })
                .done();
        };

        // merge data from parent and ajax
        // $scope.bangumiToBeLoaded is from $scope.$parent
        vm.data = angular.merge( {}, $scope.bangumiToBeLoaded, detail );

        bangumiListRestrict.hideList();
    }
]