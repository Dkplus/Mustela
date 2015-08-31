/**
 * @callback onRemovedRecentCallback
 * @param {Number} ticketId
 */
/**
 * @callback onAddedRecentCallback
 * @param {ticket} ticket
 */
/**
 * @callback onEachRecentCallback
 * @param {ticket} ticket
 */

/**
 * @typedef ticketHistory
 * @type {{add, remove, each, onAdded, onRemoved}}
 * @param {storage} storage
 */
var ticketHistory = (function (storage) {
    "use strict";
    var clearHistory = function () {
        storage.each('recent_*', function (recentItem, itemId) {
            if (new Date().getTime() - recentItem.time > 2 * 24 * 60 * 60 * 1000) {
                storage.remove(itemId);
            }
        });
    };

    /**
     * @lends ticketHistory
     */
    return {
        /**
         * @param {Number} number
         * @param {string} text
         */
        add: function (number, text) {
            clearHistory();
            storage.remove('recent_' + number);
            storage.set('recent_' + number, {ticket: ticket(number, text), time: new Date().getTime()});
        },
        /**
         * @param {onEachRecentCallback} callback
         * @param {number}               [ticketNumber]
         */
        each: function (callback, ticketNumber) {
            clearHistory();
            storage.each('recent_' + (ticketNumber || '*'), function (storedEntry) {
                callback(storedEntry.ticket);
            });
        },
        /**
         * @param {onAddedRecentCallback} callback
         * @param {number}                [ticketNumber]
         */
        onAdded: function (callback, ticketNumber) {
            clearHistory();
            storage.onAdded('recent_' + (ticketNumber || '*'), function (storedEntry) {
                callback(storedEntry.ticket);
            });
        },
        /**
         * @param {onRemovedRecentCallback} callback
         * @param {number}                  [ticketNumber]
         */
        onRemoved: function (callback, ticketNumber) {
            clearHistory();
            storage.onRemoved('recent_' + (ticketNumber || '*'), function (storageId) {
                callback(parseInt(storageId.replace(/recent_/, ''), 10));
            });
        }
    };
}(storage));

