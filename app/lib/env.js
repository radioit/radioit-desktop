const fs = require( 'fs' );
const path = require( 'path' );
const packageJson = require( '../package.json' );

exports.name = packageJson.name;
exports.description = packageJson.description;
exports.version = packageJson.version;
exports.codename = packageJson.codename;
exports.author = packageJson.author;
exports.email = packageJson.email;
exports.githubAccount = packageJson.githubAccount;

exports.root = path.resolve( path.join( __dirname, '../..' ) );
exports.settingsPath = path.resolve( exports.root, 'settings.json' );
exports.cachePath = path.resolve( exports.root, 'data', 'cache.json' );