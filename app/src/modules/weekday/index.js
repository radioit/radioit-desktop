module.exports = angular.module( 'radioit.weekday', [] )

.controller( 'WeekdayCtrl', require( './weekdayCtrl' ) )

.filter( 'isToday', require( './isTodayFilter' ) )
;