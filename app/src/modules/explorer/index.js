module.exports = angular.module( 'radioit.explorer', [] )

.service( 'explorerService', require( './explorerService' ) )

.controller( 'ExplorerCtrl', require( './explorerCtrl' ) )