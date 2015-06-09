var extend = require( 'extend' );
var env = require( './env.js' );
var Storage = require( './storage.js' );

/**
 * Setting
 *   Proxy
 *     IP
 *     Port
 *   About
 *     Author
 *     Mail
 *     Github
 */

var Default = {
    'proxy': {
        'ip': '',
        'port': 0
    },
    'about': {
        'author': env.author,
        'mail': env.mail,
        'github': env.github || ''
    }
};

var SettingManager = function () {
    if ( !( this instanceof SettingManager ) ) {
        return new SettingManager();
    }
    var self = this;

    var settingStorage = new Storage( env.settingsPath );

    // init
    settingStorage.restore( extend( true, Default, settingStorage.getItems() ) );

    self.set = function ( keyValues ) {
        var keys,
            last
            current;

        keyValues.forEach( function( el ){
            var key;
            keys = el['key'].split( '.' );
            last = keys.pop();
            current = data;

            while ( keys.length ) {
                key = keys.shift();
                if ( current[key] === null || current[key] === undefined ) {
                    current[key] = {};
                }
                current = current[key];
            }

            current[last] = el['value'];
        });
    };

    self.get = function ( keys ) {
        return settingStorage.getItems( keys );
    };
};

module.exports = SettingManager();