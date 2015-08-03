module.exports = [ '$window',
    function ( $window ) {
        var busy = false;

        this.isBusy = function () {
            return busy;
        }

        this.getCatalogue = function ( cid ) {
            busy = true;

            return $window.App.catalogue.getAsync( cid )
                .then( function ( data ) {
                    return data;
                },
                function ( err ) {
                    throw new Error( err );
                })
                .finally( function () {
                    busy = false;
                });

        };

        this.getDetail = function ( cid, bid ) {
            busy = true;

            return $window.App.bangumi.getAsync( cid, bid )
                .then( function ( data ) {
                    return data;
                },
                function ( err ) {
                    throw new Error( err );
                })
                .finally( function () {
                    busy = false;
                });
        };

        this.getAudio = function ( cid, url ) {
            busy = true;

            return $window.App.audio.getAsync( cid, url )
                .then( function ( data ) {
                    return data;
                }, function ( err ) {
                    throw new Error( err );
                })
                .finally( function () {
                    busy = false;
                });
        };
    }
]