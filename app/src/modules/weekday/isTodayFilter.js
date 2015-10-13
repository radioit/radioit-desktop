module.exports = function () {
    return function ( input ) {
        // 0 for sunday
        return input === ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getUTCDay()] ? 'tod': input;
    }
}