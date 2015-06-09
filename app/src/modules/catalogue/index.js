module.exports = angular.module( 'radioit.catalogue', ['ui.router'] )

.run( function ( $rootScope, bangumiListRestrict ) {
    // notify to revert last catalogue if failed to load catalogue
    $rootScope.$on( '$stateChangeError',
        function ( event, toState, toParams, fromState, fromParams, error ) {
            if ( toState.name === 'catalogue' ) {
                console.log( 'failed to load list' );
                $rootScope.$broadcast( 'CatalogueStateError' );
            }
        });
})

.service( 'catalogueService',
    [ '$window',
    function ( $window ){
        this.getList = function () {
            return $window.App.getCatalogueList();
        };
    }
])

.controller( 'CatalogueSwitchCtrl',
    [ '$scope', '$state', 'catalogueService', 'bangumiListRestrict',
    function( $scope, $state, catalogueService, bangumiListRestrict ){
        var vm = this;

        $scope.$on( 'CatalogueStateError', function () {
            vm.selectedCatalogue = bangumiListRestrict.revertSelectedCatalogue();
        });

        vm.list = catalogueService.getList();

        vm.switch = function () {
            bangumiListRestrict.setSelectedCatalogue( vm.selectedCatalogue );

            $state.go( 'catalogue', { catalogueID: vm.selectedCatalogue } );
        }
    }
])