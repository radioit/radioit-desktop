module.exports = angular.module( 'radioit.explorer', ['ngSanitize'] )

.service( 'explorerService', require( './explorerService' ) )

.controller( 'ExplorerCtrl', require( './explorerCtrl' ) )

.filter( 'escapeHTML', require( './escapeHTMLFilter' ) )

.filter( 'highlightText', require( './highlightTextFilter' ) )