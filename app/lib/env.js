var fs = require( 'fs' );
var path = require( 'path' );
var packageJson = require( '../package.json' );

exports.name = packageJson.name;
exports.description = packageJson.description;
exports.version = packageJson.version;
exports.author = packageJson.author;
exports.root = path.resolve( path.join( __dirname, '..' ) );
exports.settingsPath = path.resolve( exports.root, 'settings.json' );
exports.cachePath = path.resolve( exports.root, 'data', 'cache.json' );