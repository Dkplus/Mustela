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
                    .prepend('<li><a style="width: 2em" href="#" class="icon fa fa-fw fa-star-o favorite"></a></li>');
            },
            loadData: function () {
                favorites.each(function () {
                    $('.favorite').removeClass('fa-star-o').addClass('fa-star');
                }, ticketNumber);
            },
            addEventListeners: function () {
                favorites.onAdded(function () {
                    $('.favorite').removeClass('fa-star-o').addClass('fa-star');
                }, ticketNumber);

                favorites.onRemoved(function () {
                    $('.favorite').removeClass('fa-star').addClass('fa-star-o');
                }, ticketNumber);

                $('.favorite').on('click', function (event) {
                    event.preventDefault();
                    if ($(this).hasClass('fa-star-o')) {
                        favorites.add(ticketNumber);
                        return;
                    }
                    favorites.remove(ticketNumber);
                });
            }
        };
    };
}(favorites, jQuery));
