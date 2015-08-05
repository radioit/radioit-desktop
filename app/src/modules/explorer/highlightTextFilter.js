module.exports = function () {
    return function( text, className, keyword ) {
        return String( text ).replace( keyword, '<span class="' + className + '">' + keyword + '</span>' );
    }
};