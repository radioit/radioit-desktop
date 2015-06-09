module.exports = angular.module( 'radioit.weekday', [] )

.controller( 'WeekdayCtrl',
    [ 'bangumiListRestrict',
    function ( bangumiListRestrict ) {
        var vm = this;

        vm.day = [
            { id: 'mon', name: '星期一' },
            { id: 'tue', name: '星期二' },
            { id: 'wed', name: '星期三' },
            { id: 'thu', name: '星期四' },
            { id: 'fri', name: '星期五' },
            { id: 'sat', name: '星期六' },
            { id: 'sun', name: '星期日' },
            { id: 'irr', name: '不定' }
        ];

        vm.switchDay = function ( day ) {
            bangumiListRestrict.setSelectedDay( day );
        };

        vm.isSelected = function ( day ) {
            return bangumiListRestrict.getSelectedDay() == day;
        };
    }
]);