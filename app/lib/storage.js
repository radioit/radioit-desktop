var path = require( 'path' );
var fs = require( 'fs' );
var deepcopy = require( 'deepcopy' );

var Storage = function ( filePath ) {
    var self = this;

    var db = load( filePath );

    self.restore = function ( json ) {
        try {
            db = JSON.parse( JSON.stringify( json ) );
        }
        catch ( err ) {}
    };

    self.setItem = function ( key, value ) {
        db[key] = value;
        save( filePath, db );
    };

    self.setItems = function ( keyValues ) {
        keyValues.forEach( function( el ){
            db[el['key']] = el['value'];
        });
        save( filePath, db );
    };

    self.getItem = function ( key ) {
        // Never return original value
        return deepcopy( db[key] );
    };

    self.getItems = function ( keys ) {
        var _ = {};
        if ( keys ) {
            keys.forEach( function ( el ) {
                _[el] = deepcopy( db[key] );
            });
            return _;
        } else {
            return deepcopy( db );
        }
    };

    self.removeItem = function ( key ) {
        delete db[key];
        save( filePath, db );
    };
};

var load = function ( filePath ) {
    try {
        fs.accessSync( filePath, fs.R_OK | fs.W_OK );
        return JSON.parse( fs.readFileSync( filePath ).toString() );
    }
    catch ( error ) {
        console.log( error );
        return {};
    }
}

var save = function ( filePath, db ) {
    fs.writeFileSync( filePath, JSON.stringify( db, null, 4 ) );
}

module.exports = Storage;