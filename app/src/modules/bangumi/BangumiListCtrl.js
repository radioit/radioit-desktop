module.exports = [ '$state', '$stateParams', '$scope', 'bangumiListRestrict', 'list',
    function ( $state, $stateParams, $scope, bangumiListRestrict, list ) {
        var vm = this;

        vm.data = list;

        $scope.lastBangumiID = '';

        vm.isShowed = function () {
            return bangumiListRestrict.isListShowed();
        };

        vm.isSelectedDay = function ( day ) {
            return bangumiListRestrict.getSelectedDay() == day;
        }

        vm.isNew = function ( bangumi ) {
            return bangumi.status == 'new';
        }

        vm.loadDetails = function ( bangumi ) {
            // skip requesting new bangumi if loaded
            if ( $scope.lastBangumiID === bangumi.id ) {
                bangumiListRestrict.hideList();
                return;
            }

            // copy bangumi info to scope in order to pass it to child controller
            $scope.bangumiToBeLoaded = angular.merge( {}, bangumi );

            $state.go( 'catalogue.bangumi', { bangumiID: bangumi.id } );
        }

        vm.reload = function () {
            var params = angular.copy( $stateParams );
            params.catalogueCacheBuster = Math.random();

            $state.transitionTo( $state.current, params, { reload: false, inherit: true, notify: false } );
        };
    }
]