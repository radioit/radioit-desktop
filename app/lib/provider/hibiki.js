const url = require( 'url' );

const Promise = require( 'bluebird' );
const request = require( 'superagent-bluebird-promise' );

const NAME = '響 - HiBiKi Radio Station -';
const HOST = 'http://hibiki-radio.jp';

const URLs = {
    'catalogue': 'https://vcms-api.hibiki-radio.jp/api/v1/programs',
    'bangumi': 'https://vcms-api.hibiki-radio.jp/api/v1/programs/',
    'BangumiDetail': `http://hibiki-radio.jp/description/`
};

const HEADERs = {
    'Host': 'vcms-api.hibiki-radio.jp',
    'Connection': 'keep-alive',
    'Accept': 'application/json, text/plain, */*',
    'Origin': 'http://hibiki-radio.jp',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36',
    'DNT': '1',
    'Referer': 'http://hibiki-radio.jp/',
    'Accept-Encoding': 'gzip, deflate, sdch',
    'Accept-Language': 'en-US,en;q=0.8'
}

const hibiki = {
    catalogueName: NAME,
    host: HOST,

    getCatalogueAsync: function () {
        return request
            .get( URLs.catalogue )
            .set( HEADERs )
            .then( function ( res ) {
                let bangumis,
                    days,
                    data;

                let filterWithSpecKV = function ( key, value ) {
                    return function ( el ) {
                        return el[key] === value;
                    };
                };

                days = 'mon tue wed thu fri sat sun irr'.split( ' ' );
                days = {
                    'mon': 1,
                    'tue': 2,
                    'wed': 3,
                    'thu': 4,
                    'fri': 5,
                    'sat': 6,
                    'sun': 6,
                    'irr': 7,
                };

                bangumis = JSON.parse( res.text );console.log(bangumis)

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

                // Structure daily bangumis
                data = {};
                data.bangumi = {};
                Object.keys( days ).forEach( function ( el ) {
                    data.bangumi[el] = bangumis.filter( filterWithSpecKV( 'day_of_week', days[el] ) ).map( function ( el ) {
                            return {
                                'id': el.access_id,
                                'homepage': url.resolve( URLs.bangumi, el.access_id ),
                                'name': el.name,
                                'image': el.pc_image_url,
                                'status': el.update_flg || el.new_program_flg ? 'new' : 'normal'
                            };
                    });
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
            .set( HEADERs )
            .then( function ( res ) {
                var bangumi,
                    data;

                bangumi = JSON.parse( res.text );

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
                    'name': bangumi.name,
                    'homepage': url.resolve( URLs.BangumiDetail, id ),
                    'description': bangumi.description,
                    'title': bangumi.latest_episode_name,
                    'comment': bangumi.episode.episode_parts.map( function ( el ) {return el.description;}).join('\n'),
                    'schedule': bangumi.onair_information,
                    'update': bangumi.episode_updated_at,
                    'personality': bangumi.cast.replace( ', ', '\n' ),
                    'guest': '',
                    'images': bangumi.episode.episode_parts.map( function ( el ) {return el.pc_image_url;}),
                    'audio': ''
                };

                return data;

            }, function ( err ) {
                console.log( 'hibiki:get bangumi error: ' + err );
                throw new Error( err );
            });
    },

    getAudioRealUrlAsync: function ( url ) {
        return Promise.resolve( { url: 'not supported' } );
    }
};

module.exports = hibiki;