module.exports = [ 'bangumiListRestrict',
    function ( bangumiListRestrict ) {
        var vm = this;

        vm.day = [
            'mon',
            'tue',
            'wed',
            'thu',
            'fri',
            'sat',
            'sun',
            'irr'
        ];

        vm.switchDay = function ( day ) {
            bangumiListRestrict.setSelectedDay( day );
        };

        vm.isSelected = function ( day ) {
            return bangumiListRestrict.getSelectedDay() === day;
        };

        vm.isDisabled = function () {
            return !bangumiListRestrict.isListShowed();
        };

        // init
        vm.switchDay( ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getUTCDay()] );
    }
]