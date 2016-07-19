const Url = require( 'url' );

const Promise = require("bluebird");
const request = require( 'superagent-bluebird-promise' );
const cheerio = require( 'cheerio' );

const explorer = {
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
        let filetypeRe = {},
            stringRe;

        options.filetype.map( function ( val ) {
            filetypeRe[val] = new RegExp( '\\.' + val );
        });
        // RegExp original string,
        // will match 0 ~ 2 lines above or behind of the line that keyword belongs to
        // keyword is in group #4
        // (.*(\n|^)){0,2}(.*?(keyword).*?(\n|$))(.*(\n|$)){0,2}
        stringRe = new RegExp( '(.*(\\n|^)){0,2}(.*?(' + options.string + ').*?(\\n|$))(.*(\\n|$)){0,2}', 'gm' );

        return request
            .get( url )
            .then( function ( res ) {
                let $,
                    _,
                    lines,
                    sections = [],
                    files = {},
                    seen = {};

                $ = cheerio.load( res.text, {
                    'decodeEntities': true,
                    'lowerCaseAttributeNames': true
                });

                for ( let type in filetypeRe ) {
                    files[type] = [];
                }

                // search 'href' in every <a> and 'src' in every <source>
                $( 'a,source' ).map( function () {
                    _ = $( this );

                    for ( let type in filetypeRe ) {
                        if ( _[0].name === 'a' ) {
                            filetypeRe[type].test( _.attr( 'href' ) ) && !seen[_.attr( 'href' )]  && files[type].push( Url.resolve( url, _.attr( 'href' ) ) ) && ( seen[_.attr( 'href' )] = true );
                        } else if ( _[0].name === 'source' ) {
                            filetypeRe[type].test( _.attr( 'src' ) ) && !seen[_.attr( 'href' )] && files[type].push( Url.resolve( url, _.attr( 'src' ) ) ) && ( seen[_.attr( 'href' )] = true );
                        }
                    }
                });
                $ = _ = null;

                // search keyword in the whole document
                while ( ( lines = stringRe.exec( res.text ) ) !== null ) {
                    sections.push({
                        'text': lines[0],
                        'keyword': lines[4]
                    });
                }

                return {
                    'filetype': files,
                    'string': sections
                };
            }, function ( err ) {
                console.log( 'explorer:explore url error: ' + err );
                throw new Error( err );
            });
    }
};

module.exports = explorer;