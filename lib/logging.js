/**
 * @callback onEachLoggingCallback
 * @param {ticket} ticket
 */

/**
 * @callback onStartedLoggingCallback
 * @param {ticket} ticket
 */

/**
 * @callback onResumedLoggingCallback
 * @param {ticket} ticket
 */

/**
 * @callback onStoppedLoggingCallback
 * @param {ticket} ticket
 */

/**
 * @callback onRemovedLoggingCallback
 * @param {Number} ticketNumber
 */

/**
 * @typedef logging
 * @type {{start, stop, remove, each, onStarted, onResumed, onRemoved, onStopped}}
 * @param {storage} storage
 * @param {ticketHistory} history
 * @param {settings} settings
 * @param {jQuery} jQuery
 */
var logging = (function (storage, history, settings, jQuery) {
    "use strict";
    var startLogging,
        resumeLogging,
        stopLogging,
        calculateLoggedTime,
        createTicketFromStorageItem;

    createTicketFromStorageItem = function (storageItem) {
        return ticket(
            storageItem.ticket.number,
            storageItem.ticket.text,
            storageItem.logs.length % 2 === 1,
            calculateLoggedTime(storageItem.logs)
        );
    };

    calculateLoggedTime = function (logs) {
        var i, start, end, durationInMilliseconds = 0;
        for (i = 0; i < logs.length; i += 2) {
            start = logs[i];
            end   = logs.length === i + 1 ? new Date().getTime() : logs[i + 1];
            durationInMilliseconds += (end - start);
        }
        return Math.round(durationInMilliseconds);
    };

    startLogging = function (ticketNumber, ticketText) {
        storage.set(
            'logging_' + ticketNumber,
            {
                ticket: ticket(ticketNumber, ticketText),
                logs: [new Date().getTime()]
            }
        );
    };

    resumeLogging = function (ticketNumber) {
        storage.each('logging_' + ticketNumber, function (storageItem, storageItemId) {
            storageItem.logs.push(new Date().getTime());
            storage.set(storageItemId, storageItem);
        });
    };

    stopLogging = function (ticketNumber) {
        storage.each('logging_' + ticketNumber, function (storageItem, storageItemId) {
            if (storageItem.logs.length % 2 !== 0) {
                storageItem.logs.push(new Date().getTime());
            }
            storage.set(storageItemId, storageItem);
        });
    };

    /**
     * @lends logging
     */
    return {
        /**
         * @param {Number} ticketNumber
         */
        start: function (ticketNumber) {
            settings.baseUrl(function (baseUrl) {
                jQuery.getJSON(baseUrl + '/api/v3/work_packages/' + ticketNumber, function (jsonData) {
                    var ticketText = jsonData.type + ': ' + jsonData.subject;

                    history.add(ticketNumber, ticketText);
                    storage.contains('logging_' + ticketNumber, function (contained) {
                        if (!contained) {
                            startLogging(ticketNumber, ticketText);
                            return;
                        }
                        resumeLogging(ticketNumber);
                    });
                });
            });
        },
        /**
         * @param {Number} ticketNumber
         */
        stop: function (ticketNumber) {
            stopLogging(ticketNumber);
        },
        /**
         * @param {Number} ticketNumber
         */
        remove: function (ticketNumber) {
            storage.remove('logging_' + ticketNumber);
        },
        /**
         * @param {onEachLoggingCallback} callback
         * @param {Number}                [ticketNumber]
         */
        each: function (callback, ticketNumber) {
            storage.each('logging_' + (ticketNumber || '*'), function (storageItem) {
                callback(createTicketFromStorageItem(storageItem));
            });
        },
        /**
         * @param {onStartedLoggingCallback} callback
         * @param {Number}                   [ticketNumber]
         */
        onStarted: function (callback, ticketNumber) {
            storage.onAdded('logging_' + (ticketNumber || '*'), function (storageItem) {
                callback(createTicketFromStorageItem(storageItem));
            });
        },
        /**
         * @param {onResumedLoggingCallback} callback
         * @param {Number}                   [ticketNumber]
         */
        onResumed: function (callback, ticketNumber) {
            storage.onChanged('logging_' + (ticketNumber || '*'), function (storageItem) {
                var ticket = createTicketFromStorageItem(storageItem);
                if (ticket.running) {
                    callback(ticket);
                }
            });
        },
        /**
         * @param {onStoppedLoggingCallback} callback
         * @param {Number}                   [ticketNumber]
         */
        onStopped: function (callback, ticketNumber) {
            storage.onChanged('logging_' + (ticketNumber || '*'), function (storageItem) {
                var ticket = createTicketFromStorageItem(storageItem);
                if (!ticket.running) {
                    callback(ticket);
                }
            });
        },
        /**
         * @param {onRemovedLoggingCallback} callback
         * @param {Number}                   [ticketNumber]
         */
        onRemoved: function (callback, ticketNumber) {
            storage.onRemoved('logging_' + (ticketNumber || '*'), function (storageId) {
                callback(parseInt(storageId.replace(/logging_/, ''), 10));
            });
        }
    };
}(storage, ticketHistory, settings, jQuery));
