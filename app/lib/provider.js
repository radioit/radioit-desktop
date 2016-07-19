const catalogue = {
    'hibiki': require( './provider/hibiki.js' ),
    'onsen': require( './provider/onsen.js' ),
    'animate': require( './provider/animate.js' )
};

const provider = {
    /**
     * Get the list of catalogue
     * @return {Array} list of catalogue
     */
    getCatalogueList: function () {
        let arr = [],
            item;

        for ( item in catalogue ) {
            arr.push({
                id: item,
                name: catalogue[item].catalogueName,
                host: catalogue[item].host
            });
        }

        return arr;
    },

    /**
     * Get bangumi catalogue
     * @param  {String} id   id of catalogue
     * @return {JSON}   catalogue data
     *
     * Data should be formated as a json object in following structure:
     * {
     *     'name': 'String, name of the catalogue',
     *     'url': 'String, url of the catalogue',
     *     'timestamp': 'Number, timestamp of this data',
     *     'bangumi': {
     *         'mon': [
     *             {
     *                 'id': 'String, id of the bangumi',
     *                 'homepage': 'URL, homepage of the bangumi',
     *                 'name': 'String, name of the bangumi',
     *                 'image': 'String, image url  of the bangumi, optional',
     *                 'status': 'String, new / normal',
     *                 'custom': {
     *                     '...': '...'
     *                 }
     *             },
     *             {...}
     *         ],
     *         'tue': [{...},{...}],
     *         'wed': [{...},{...}],
     *         'thu': [{...},{...}],
     *         'fri': [{...},{...}],
     *         'sat': [{...},{...}],
     *         'sun': [{...},{...}],
     *         'irr': [{...},{...}],
     *     }
     * }
     */
    getCatalogueAsync: function ( id ) {
        let c;

        if ( !( c = catalogue[id] ) ) {
            return;
        }

        return c.getCatalogueAsync();
    },

    /**
     * Get bangumi details
     * @param  {String} id   id of the bangumi
     * @return {JSON}   bangumi details in json format
     *
     * Data should be formated as a json object in following structure:
     * {
     *     'timestamp': 'Number',
     *     'name': 'String, name of the bangumi',
     *     'homepage': 'URL, homepage of hte bangumi',
     *     'description': 'String, description of the bangumi',
     *     'title': 'String, title of the newest episode',
     *     'comment': 'String, comment of the newest episode',
     *     'schedule': 'String, schedule of the bangumi or the update date of the newest episode',
     *     'personality': 'String, personality of the bangumi',
     *     'guest': 'String, guest of the newest episode',
     *     'images': 'String Array, array of images' url',
     *     'audio': 'String, url of audio'
     * }
     */
    getBangumiAsync: function ( catalogueID, bangumiID ) {
        let c;

        if ( !( c = catalogue[catalogueID] ) ) {
            return;
        }

        return c.getBangumiAsync( bangumiID );
    },

    /**
     * Get real url of bangumi's audio
     * @param  {String} url  url from the bangumi homepage
     * @return {String}
     *
     * Data should be formated as a json object in following structure:
     * {
     *     'url': 'URL, http://.......  or  mms://...........',
     *     'downloadSupported': 'Boolean'
     * }
     */
    getAudioRealUrlAsync: function ( catalogueID,  url ) {
        let c;

        if ( !( c = catalogue[catalogueID] ) ) {
            return;
        }

        return c.getAudioRealUrlAsync( url );
    }
};

module.exports = provider;