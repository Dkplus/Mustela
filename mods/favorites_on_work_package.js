/**
 * @typedef favorites_on_work_package_factory
 * @param {favorites} favorites
 * @param {jQuery}    $
 */
var favorites_on_work_package_factory = (function (favorites, $) {
    "use strict";

    /**
     * @class favorites_on_work_package
     */
    return function (pathname) {
        var regExp = /^\/work_packages\/(\d+)$/, ticketNumber;

        if (!regExp.test(pathname)) {
            return {modifyHtml: function () {}, loadData: function () {}, addEventListeners: function () {}};
        }

        ticketNumber = regExp.exec(pathname)[1];

        /**
         * @lends favorites_on_work_package
         */
        return {
            modifyHtml: function () {
                $('.action_menu_specific')
                    .prepend('<li><a href="#" class="icon fa fa-heart-o favorite">Favorite</a></li>')
                    .prepend('<li style="display: none;"><a href="#" class="icon fa fa-heart unfavorite">Unfavorite</a></li>');
            },
            loadData: function () {
                favorites.each(function () {
                    $('.favorite').parent().hide();
                    $('.unfavorite').parent().show();
                }, ticketNumber);
            },
            addEventListeners: function () {
                favorites.onAdded(function () {
                    $('.favorite').parent().hide();
                    $('.unfavorite').parent().show();
                }, ticketNumber);

                favorites.onRemoved(function () {
                    $('.favorite').parent().show();
                    $('.unfavorite').parent().hide();
                }, ticketNumber);

                $('.favorite').on('click', function (event) {
                    event.preventDefault();
                    favorites.add(ticketNumber);
                });

                $('.unfavorite').on('click', function (event) {
                    event.preventDefault();
                    favorites.remove(ticketNumber);
                });
            }
        };
    };
}(favorites, jQuery));
