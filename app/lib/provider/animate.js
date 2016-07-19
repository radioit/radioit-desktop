const url = require( 'url' );

const Promise = require( 'bluebird' );
const request = require( 'superagent-bluebird-promise' );
const cheerio = require( 'cheerio' );

const NAME = 'ウェブラジオ - アニメイトタイムズ';
const HOST = 'http://www.animatetimes.com/radio';

const URLs = {
    'catalogue': 'http://www.animatetimes.com/radio',
    'bangumi': 'http://www.animatetimes.com/radio/'
};

const animate = {
    catalogueName: NAME,
    host: HOST,

    getCatalogueAsync: function () {
        return request
            .get( URLs.catalogue )
            .then( function ( res ) {
                let $,
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
                    let _;

                    data.bangumi[el] = $( '#' + el + ' .box' ).map( function () {
                        _ = $( this );
                        return {
                            'id': _.find( 'a' ).attr( 'href' ).slice( 22 ),
                            'homepage': url.resolve( URLs.catalogue, _.find( 'a' ).attr( 'href' ) ),
                            'name': _.find( '.title' ).text(),
                            'image': url.resolve( URLs.catalogue, _.find( '.img img').attr( 'src' ) ),
                            'status': 'normal',
                            'update': _.find( '.date' ).text(),
                            'personality': _.find( '.main' ).text()
                        };
                    }).get();

                    _ = null;
                });

                // add extra data
                data.name = NAME;
                data.url = HOST;
                data.timestamp = Date.now();

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
                let $,
                    data;

                $ = cheerio.load( res.text, {
                    'decodeEntities': true,
                    'lowerCaseAttributeNames': true
                });

                // Extract html and structure data
                // data will be formated as a json object in following structure:
                // {
                //     'timestamp': 'Number',
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
                    'timestamp': Date.now(),
                    'name': $( 'title' ).text().trim(),
                    'homepage': url.resolve( URLs.bangumi, id ),
                    'description': $( '#tabBox02' ).text().trim(),
                    'title': $( '.radioTitle' ).text().trim(),
                    'comment': $( '#tabBox01' ).text().trim(),
                    'schedule': $( '.entry .textBox' ).text().trim(),
                    'personality': $( '.textBox ul li' ).map( function () {return $( this ).text() }).get(),
                    'guest': '',
                    'images': (function () {
                        let image = $( '#tabBox01 img' );
                        image = image.length ? image : $( '.photo img' );
                        return image.map( function () {return url.resolve( URLs.catalogue, $( this ).attr( 'src' ) );} ).get();
                    })(),
                    'audio': url.resolve( URLs.catalogue, $( '.wmp a' ).attr( 'href' ) )
                };

                return data;

            }, function ( err ) {
                console.log( 'animate:get bangumi error: ' + err );
                throw new Error( err );
            });
    },

    getAudioRealUrlAsync: function ( url ) {
        return request
            .get( url )
            .then( function ( res ) {
                return request.get( res.redirects[0] ).buffer(); // .buffer() is important
            }, function ( err ) {
                console.log( 'animate:get audio error: ' + err );
                throw new Error( err );
            })
            .then( function ( res ) {console.log(res)
                let $,
                    data;

                $ = cheerio.load( res.text, {
                    'decodeEntities': true,
                    'lowerCaseAttributeNames': true
                });

                // Extract html and structure data
                // data will be formated as a json object in following structure:
                // Data should be formated as a json object in following structure:
                // {
                //     'url': 'URL, http://.......  or  mms://...........',
                //     'downloadSupported': 'Boolean'
                // }
                data = {
                    'url': $( 'ref' ).eq( 0 ).attr( 'href' ),
                    'downloadSupported': false
                };

                return data;

            }, function ( err ) {
                console.log( 'animate:get audio error: ' + err );
                throw new Error( err );
            });
    }
};

module.exports = animate;