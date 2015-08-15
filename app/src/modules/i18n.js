module.exports = function( $translateProvider ) {
    $translateProvider.useSanitizeValueStrategy( 'escape' );
    $translateProvider
        .translations( 'en', require( './i18n/en' ) )
        .translations( 'chs', require( './i18n/chs' ) );
    $translateProvider.preferredLanguage( 'chs' );
}