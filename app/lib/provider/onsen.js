const url = require( 'url' );

const Promise = require( 'bluebird' );
const request = require( 'superagent-bluebird-promise' );
const cheerio = require( 'cheerio' );

const NAME = 'インターネットラジオステーション＜音泉＞';
const HOST = 'http://www.onsen.ag';

const URLs = {
    'catalogue': 'http://www.onsen.ag',
    'bangumi': 'http://www.onsen.ag/program/',
    'audio': 'http://www.onsen.ag/data/api/getMovieInfo/'
};

const onsen = {
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

                days = 'mon tue wed thu fri sat sun irr'.split( ' ' );

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
                    data.bangumi[el] = [];
                });

                // Structure daily bangumis
                $( 'li', '.listWrap' ).each( function ( i, el ) {
                    let _;

                    _ = $( this );
                    data.bangumi[_.data( 'week' )].push({
                        'id': _.attr( 'id' ),
                        'homepage': url.resolve( URLs.catalogue, _.find( '.programLink a' ).attr( 'href' ) ),
                        'name': _.find( 'h4' ).text(),
                        'image': url.resolve( URLs.catalogue, _.find( '.thumbnail img' ).eq( 0 ).attr( 'src' ) ),
                        'status': _.hasClass( 'newChecked' ) ? 'new' : 'normal',
                        'update': _.find( 'p.update' ).text().slice( 0, -2 ).trim(),
                        'personality': _.find( '.navigator' ).text().trim(),
                        'guest': _.data( 'guest' ) ? _.data( 'guest' ) : ''
                    });

                    _ = null;
                });

                // add extra data
                data.name = NAME;
                data.url = HOST;
                data.timestamp = Date.now();

                return data;

            }, function ( err ) {
                console.log( 'onsen:get catalogue error: ' + err );
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
                    'name': $( '#outLineWrap h1' ).text().trim(),
                    'homepage': url.resolve( URLs.bangumi, id ),
                    'description': $( '#introductionWrap p' ).text().trim(),
                    'title': $( '#newProgramWrap .programContHeader h1' ).text().trim(),
                    'comment': $( '.newProgramRight p' ).text().trim(),
                    'schedule': $( '#updateText' ).text().trim(),
                    'update': $( '.newProgramUpdate' ).text().trim(),
                    'personality': $( '.personality02' ).map( function () { return $( this ).text().trim();} ).get().join( ' ' ),
                    'guest': '',
                    'image': url.resolve( res.request.url, $( '#mainImg img' ).attr( 'src' ) ),
                    'images': $( '.newProgramLeft > img' ).map( function () {return url.resolve( URLs.bangumi, id ) + '/' + $( this ).attr( 'src' );}).get(),
                    'audio': url.resolve( URLs.audio, id )
                };

                return data;

            }, function ( err ) {
                console.log( 'onsen:get bangumi error: ' + err );
                throw new Error( err );
            });
    },

    getAudioRealUrlAsync: function ( url ) {
        // Extract html and structure data
        // data will be formated as a json object in following structure:
        // Data should be formated as a json object in following structure:
        // {
        //     'url': 'URL, http://.......  or  mms://...........',
        //     'downloadSupported': 'Boolean'
        // }
        return request
            .get( url )
            .then( function ( res ) {
                let json = JSON.parse( res.text.slice( 9, -3 ) );
                return {
                    'url': json["moviePath"]["pc"],
                    'downloadSupported': true
                }
            }, function ( err ) {
                console.log( 'onsen:get audio error: ' + err );
                throw new Error( err );
            });
    }
};

module.exports = onsen;