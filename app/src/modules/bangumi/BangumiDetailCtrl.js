module.exports = [ '$state', '$scope', '$stateParams', 'detail',
    function ( $state, $scope, $stateParams, detail ) {
        var vm = this;

        $scope.$parent.isListShowed = false;
        $scope.$parent.lastBangumiID = $stateParams.bangumiID;

        vm.isListShowed = function () {
            return $scope.$parent.isListShowed;
        };

        vm.goBack = function () {
            $scope.$parent.isListShowed = true;
        };

        vm.reload = function () {
            var params = angular.copy( $stateParams );
            params.bangumiCacheBuster = Math.random();

            $state.transitionTo( $state.current, params, { reload: false, inherit: true, notify: false } );
        };

        vm.data = angular.merge( detail, $scope.bangumiToBeLoaded );
    }
]