/**
 * @callback onRemovedFavoriteCallback
 * @param {Number} ticketId
 */
/**
 * @callback onAddedFavoriteCallback
 * @param {ticket} ticket
 */
/**
 * @callback onEachFavoritesCallback
 * @param {ticket} ticket
 */

/**
 * @typedef favorites
 * @type {{add, remove, each, onAdded, onRemoved}}
 * @param {storage} storage
 * @param {settings} settings
 * @param {jQuery} jQuery
 */
var favorites = (function (storage, settings, jQuery) {
    "use strict";

    /**
     * @lends favorites
     */
    return {
        /**
         * @param {Number} number
         */
        add: function (number) {
            settings.baseUrl(function (baseUrl) {
                jQuery.getJSON(baseUrl + '/api/v3/work_packages/' + number, function (jsonData) {
                    var text = jsonData.type + ': ' + jsonData.subject;

                    storage.set('favorite_' + number, ticket(number, text));
                });
            });
        },
        /**
         * @param {Number} number
         */
        remove: function (number) {
            storage.remove('favorite_' + number);
        },
        /**
         * @param {onEachFavoritesCallback} callback
         * @param {number}                  [ticketNumber]
         */
        each: function (callback, ticketNumber) {
            storage.each('favorite_' + (ticketNumber || '*'), callback);
        },
        /**
         * @param {onAddedFavoriteCallback} callback
         * @param {number}                  [ticketNumber]
         */
        onAdded: function (callback, ticketNumber) {
            storage.onAdded('favorite_' + (ticketNumber || '*'), callback);
        },
        /**
         * @param {onRemovedFavoriteCallback} callback
         * @param {number}                    [ticketNumber]
         */
        onRemoved: function (callback, ticketNumber) {
            storage.onRemoved('favorite_' + (ticketNumber || '*'), function (storageId) {
                callback(parseInt(storageId.replace(/favorite_/, ''), 10));
            });
        }
    };
}(storage, settings, jQuery));
