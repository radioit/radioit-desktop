const extend = require( 'extend' );
const env = require( './env.js' );
const Storage = require( './storage.js' );

const settingStorage = new Storage( env.settingsPath );

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

const Default = {
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

const SettingManager = {
    save: function ( data ) {
        delete data.about;
        settingStorage.restore( data );
        settingStorage.save();
    },

    load: function () {
        return settingStorage.getItems();
    }
};

module.exports = SettingManager;