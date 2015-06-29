var extend = require( 'extend' );
var env = require( './env.js' );
var Storage = require( './storage.js' );

var settingStorage = new Storage( env.settingsPath );

/**
 * Setting
 *   proxy
 *     enable
 *     ip
 *     port
 *   timout
 *     hour
 *     minute
 *     second
 *   about
 *     author
 *     email
 *     github
 */

var Default = {
    'proxy': {
        'enable': false,
        'ip': '',
        'port': 0
    },
    'timeout': {
        'hour': 0,
        'minute': 0,
        'second': 60 // default is 60 seconds
    },
    'about': {
        'author': env.author || '',
        'email': env.email || '',
        'github': env.github || ''
    }
};


// init
settingStorage.restore( extend( true, {}, Default, settingStorage.getItems() ) );
settingStorage.save();

var SettingManager = {
    save: function ( data ) {
        settingStorage.restore( data );
        settingStorage.save();
    },

    get: function () {
        return settingStorage.getItems();
    }
};

module.exports = SettingManager;