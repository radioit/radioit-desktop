module.exports = [ '$window',
    function ( $window ){
        this.getList = function () {
            return $window.App.catalogue.getList();
        };
    }
]