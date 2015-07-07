module.exports = [ '$scope', '$state', 'catalogueService', 'bangumiListRestrict',
    function( $scope, $state, catalogueService, bangumiListRestrict ){
        var vm = this;

        vm.list = catalogueService.getList();

        vm.switch = function ( id ) {
            bangumiListRestrict.setSelectedCatalogue( id );

            $state.go( 'catalogue', { catalogueID: id } );
        }

        vm.isDisabled = function () {
            return !bangumiListRestrict.isListShowed();
        };
    }
]