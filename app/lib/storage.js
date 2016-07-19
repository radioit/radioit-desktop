const path = require( 'path' );
const fs = require( 'fs' );
const deepcopy = require( 'deepcopy' );

const Storage = function ( filePath ) {
    const self = this;

    let db = load( filePath );

    self.restore = function ( json ) {
        try {
            db = JSON.parse( JSON.stringify( json ) );
        }
        catch ( err ) {}
    };

    self.save = function () {
        try {
            save( filePath, db );
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
        let _ = {};
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

var load = function ( filePath ) {console.log( 'load file:' + filePath );
    try {
        fs.accessSync( filePath, fs.R_OK | fs.W_OK );
        return JSON.parse( fs.readFileSync( filePath ).toString() );
    }
    catch ( error ) {
        console.log( error );
        return {};
    }
}

var save = function ( filePath, db ) {console.log( 'save file:' + filePath );
    fs.writeFileSync( filePath, JSON.stringify( db ) );
}

module.exports = Storage;