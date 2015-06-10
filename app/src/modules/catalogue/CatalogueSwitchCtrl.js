module.exports = [ '$scope', '$state', 'catalogueService', 'bangumiListRestrict',
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
]