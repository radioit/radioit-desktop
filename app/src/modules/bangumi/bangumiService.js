module.exports = [ '$window',
    function ( $window ) {
        var busy = false;

        this.isBusy = function () {
            return busy;
        }

        this.getList = function ( cid ) {
            busy = true;

            return $window.App.getCatalogueAsync( cid )
                .then( function ( data ) {
                    return data;
                },
                function ( err ) {
                    throw new Error(err);
                })
                .finally( function () {
                    busy = false;
                });

        };

        this.getDetail = function ( cid, bid ) {
            busy = true;

            return $window.App.getBangumiAsync( cid, bid )
                .then( function ( data ) {
                    return data;
                },
                function ( err ) {
                    throw new Error(err);
                })
                .finally( function () {
                    busy = false;
                });
        };
    }
]