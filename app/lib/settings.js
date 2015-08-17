var extend = require( 'extend' );
var env = require( './env.js' );
var Storage = require( './storage.js' );

var settingStorage = new Storage( env.settingsPath );

/**
 * Setting
 *   timout
 *     hour
 *     minute
 *     second
 *   language
 *   about
 *     author
 *     email
 *     githubAccount
 *     version
 *     codename
 */

var Default = {
    'timeout': {
        'hour': 0,
        'minute': 0,
        'second': 60 // default is 60 seconds
    },
    'language': 'en',
    'about': {
        'author': env.author || '',
        'email': env.email || '',
        'githubAccount': env.githubAccount || '',
        'version': env.version,
        'codename': env.codename
    }
};


// init
settingStorage.restore( extend( true, {}, Default, settingStorage.getItems() ) );
settingStorage.save();

var SettingManager = {
    save: function ( data ) {
        delete data.about;
        settingStorage.restore( data );
        settingStorage.save();
    },

    get: function () {
        return settingStorage.getItems();
    }
};

module.exports = SettingManager;