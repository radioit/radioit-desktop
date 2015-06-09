var url = require( 'url' );

var Promise = require( 'bluebird' );
var request = require( 'superagent-bluebird-promise' );
var cheerio = require( 'cheerio' );

var NAME = 'ウェブラジオ - アニメイトTV';
var HOST = 'http://www.animate.tv/radio';

var URLs = {
    'catalogue': 'http://animate.tv/radio',
    'bangumi': 'http://animate.tv/radio/'
}

var animate = {
    catalogueName: NAME,
    host: HOST,

    getCatalogueAsync: function () {
        return request
            .get( URLs.catalogue )
            .then( function ( res ) {
                var $,
                    days,
                    bangumi,
                    data;

                days = 'mon tue wed thu fri irr'.split( ' ' );

                $ = cheerio.load( res.text, {
                    'decodeEntities': true,
                    'lowerCaseAttributeNames': true
                });

                // Extract html and structure data
                // data will be formated as a json object in following structure:
                // {
                //     'name': 'String, name of the channel',
                //     'url': 'String, url of the channel',
                //     'timestamp': 'Number, timestamp of this data',
                //     'bangumi': {
                //         'mon': [
                //             {
                //                 'id': 'String, id of the bangumi',
                //                 'homepage': 'URL, homepage of the bangumi',
                //                 'name': 'String, name of the bangumi',
                //                 'image': 'String, image url  of the bangumi, optional',
                //                 'status': 'String, new / normal',
                //                 ...
                //             },
                //             {...}
                //         ],
                //         'tue': [{...},{...}],
                //         'wed': [{...},{...}],
                //         'thu': [{...},{...}],
                //         'fri': [{...},{...}],
                //         'sat': [{...},{...}],
                //         'sun': [{...},{...}],
                //         'irr': [{...},{...}],
                //     }
                // }
                data = {};
                data.bangumi = {};
                days.forEach( function ( el ) {
                    var _;

                    data.bangumi[el] = $( '#' + el + ' .contents_block_A' ).map( function () {
                        _ = $( this );
                        return {
                            'id': _.find( '.title a' ).attr( 'href' ).slice( 22 ),
                            'homepage': url.resolve( URLs.catalogue, _.find( '.title a' ).attr( 'href' ) ),
                            'name': _.find( '.title a' ).text(),
                            'image': _.find( '.image img').attr( 'src' ),
                            'status': _.find( '.textArea p.new' ) ? 'new' : 'normal',
                            'update': _.find( '.date' ).text().slice( 0, 16 ),
                            'personality': _.find( '.text' ).text().slice( 8 )
                        };
                    }).get();

                    _ = null;
                });

                // add extra data
                data.name = NAME;
                data.url = HOST;
                data.timestamp = new Date().getTime();

                return data;

            }, function ( err ) {
                console.log( 'animate:get catalogue error: ' + err );
                throw new Error( err );
            });
    },

    getBangumiAsync: function ( id ) {
        return request
            .get( url.resolve( URLs.bangumi, id ) )
            .then( function ( res ) {
                var $,
                    data;

                $ = cheerio.load( res.text, {
                    'decodeEntities': true,
                    'lowerCaseAttributeNames': true
                });

                // Extract html and structure data
                // data will be formated as a json object in following structure:
                // {
                //     'name': 'String, name of the bangumi',
                //     'homepage': 'URL, homepage of the bangumi',
                //     'description': 'String, description of the bangumi',
                //     'title': 'String, title of the newest episode',
                //     'comment': 'String, comment of the newest episode',
                //     'schedule': 'String, schedule of the bangumi or the update date of the newest pisode',
                //     'personality': 'String, personality of the bangumi',
                //     'guest': 'String, guest of the newest episode',
                //     'images': 'String Array, array of images' url',
                //     'audio': 'String, url of audio'
                // }
                data = {
                    'name': $( '.ttl' ).text().trim(),
                    'homepage': url.resolve( URLs.bangumi, id ),
                    'description': $( '.tab-outline' ).text().trim(),
                    'title': $( '.broadcast_title' ).text().trim(),
                    'comment': $( '.textBox' ).text().trim(),
                    'schedule': $( '.ttlArea .date' ).eq( 0 ).text().trim(),
                    'personality': '',
                    'guest': '',
                    'images': (function () {
                        var image = $( '.thumbnail img' );
                        image = image.length ? image : $( '.box_img > img' );
                        return image.map( function() {return url.resolve( URLs.catalogue, $( this ).attr( 'src' ) );} ).get();
                    })(),
                    'audio': url.resolve( URLs.catalogue, $( '.playBox' ).eq( -1 ).find( '.btn > a' ).eq( 0 ).attr( 'href' ) )
                };

                return data;

            }, function ( err ) {
                console.log( 'animate:get bangumi error: ' + err );
                throw new Error( err );
            });
    },

    getAudioRealUrlAsync: function ( url ) {}
};

module.exports = animate;