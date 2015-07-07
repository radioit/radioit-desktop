module.exports = [ 'bangumiListRestrict',
    function ( bangumiListRestrict ) {
        var vm = this;

        vm.day = [
            { id: 'mon', name: 'monday' },
            { id: 'tue', name: 'tuesday' },
            { id: 'wed', name: 'wednesday' },
            { id: 'thu', name: 'thusday' },
            { id: 'fri', name: 'friday' },
            { id: 'sat', name: 'saturday' },
            { id: 'sun', name: 'sunday' },
            { id: 'irr', name: 'irr' }
        ];

        vm.switchDay = function ( day ) {
            bangumiListRestrict.setSelectedDay( day );
        };

        vm.isSelected = function ( day ) {
            return bangumiListRestrict.getSelectedDay() == day;
        };

        vm.isDisabled = function () {
            return !bangumiListRestrict.isListShowed();
        };
    }
]