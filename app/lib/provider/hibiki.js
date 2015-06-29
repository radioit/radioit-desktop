var url = require( 'url' );

var Promise = require( 'bluebird' );
var request = require( 'superagent-bluebird-promise' );
var cheerio = require( 'cheerio' );

var NAME = '響 - HiBiKi Radio Station -';
var HOST = 'http://hibiki-radio.jp';

var URLs = {
    'catalogue': 'http://hibiki-radio.jp/program',
    'bangumi': 'http://hibiki-radio.jp/description/'
}

var hibiki = {
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
                //                 'status': 'String, new / normal'
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
                $( '.hbkProgramTable' ).each( function ( i, el ) {
                    var _;

                    data.bangumi[days[i]] = $( this ).find( '.hbkProgramTitleNew, .hbkProgramTitle' ).map( function ( _, el ) {
                        _ = $( this );

                        return {
                            'id': _.parent().attr( 'href' ).slice( 35 ),
                            'homepage': _.parent().attr( 'href' ),
                            'name': _.text(),
                            'image': _.prev().children().eq( 0 ).attr( 'src' ),
                            'status': _.attr( 'class' ) === 'hbkProgramTitleNew' ? 'new' : 'normal'
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
                console.log( 'hibiki:get catalogue error: ' + err );
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
                    'name': $( 'title' ).text().slice( 27, -5 ),
                    'homepage': url.resolve( URLs.bangumi, id ),
                    'description': $( 'table.hbkTextTable td:nth-of-type(1) div:nth-of-type(1)' ).eq( 0 ).text().trim(),
                    'title': $( 'table.hbkTextTable td:nth-of-type(1) div:nth-of-type(3) table:nth-of-type(1) div' ).eq( 0 ).text().trim(),
                    'comment': $( 'table.hbkTextTable td:nth-of-type(1) div:nth-of-type(3) table:nth-of-type(2) td' ).eq( 0 ).text().trim(),
                    'schedule': (function () {
                        var _, text;
                        _ = $( 'table.hbkTextTable > tr > td:nth-of-type(2) > div' );
                        if ( !( text = _.eq( -5 ).text().trim() ) ) {
                            text = _.eq( -3 ).text();
                        }
                        return text;
                    })(),
                    'update': $( '.hbkDescriptonContents' ).eq( -1 ).prev().prev().find( 'span' ).eq( 0 ).text(),
                    'personality': $( 'table.hbkTextTable td:nth-of-type(1) > table table td:nth-of-type(2n) a' ).map( function () {return $( this ).text();} ).get().join( ' ' ),
                    'guest': '',
                    'images': $( 'table.hbkTextTable td:nth-of-type(1) div:nth-of-type(3) table:nth-of-type(2) td img' ).map( function () {return $( this ).attr( 'src' );}).get(),
                    'audio': $( 'div.hbkDescriptonContents embed' ).eq( -1 ).attr( 'src' )
                };

                return data;

            }, function ( err ) {
                console.log( 'hibiki:get bangumi error: ' + err );
                throw new Error( err );
            });
    },

    getAudioRealUrlAsync: function ( url ) {}
};

module.exports = hibiki;