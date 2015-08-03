var Url = require( 'url' );

var Promise = require("bluebird");
var request = require( 'superagent-bluebird-promise' );
var cheerio = require( 'cheerio' );

var explorer = {
    // anlayze web page, focus on specifical filetype and string
    // @param url
    // @param options, = {
    //     'filetype': ['mp3', 'wav', ...],
    //     'string': 'foo'
    // }
    // @return {
    //     'filetype': {
    //         'mp3': [],
    //         'wav': [],
    //         ...
    //     },
    //     'string': [
    //         '...',
    //         '...',
    //         ...
    //     ]
    // }
    explore: function ( url, options ) {
        var filetypeRe = {},
            stringRe;

        options.filetype.map( function ( val ) {
            filetypeRe[val] = new RegExp( '\\.' + val );
        });
        stringRe = new RegExp( options.string );

        return request
            .get( url )
            .then( function ( res ) {
                var $,
                    _,
                    files = {};

                $ = cheerio.load( res.text, {
                    'decodeEntities': true,
                    'lowerCaseAttributeNames': true
                });

                for ( var type in filetypeRe ) {
                    files[type] = [];
                }

                // search 'href' in every <a> and 'src' in every <source>
                $( 'a,source' ).map( function () {
                    _ = $( this );

                    for ( var type in filetypeRe ) {
                        if ( _[0].name === 'a' ) {
                            filetypeRe[type].test( _.attr( 'href' ) ) && files[type].push( Url.resolve( url, _.attr( 'href' ) ) );
                        } else if ( _[0].name === 'source' ) {
                            filetypeRe[type].test( _.attr( 'src' ) ) && files[type].push( Url.resolve( url, _.attr( 'src' ) ) );
                        }
                    }
                });
                $ = _ = null;

                return {
                    'filetype': files
                };
            }, function ( err ) {
                console.log( 'explorer:explore url error: ' + err );
                throw new Error( err );
            });
    }
};

module.exports = explorer;