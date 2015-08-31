/**
 * @callback onChangedCacheItemCallback
 * @param {*}      value
 * @param {string} key
 */

/**
 * @callback onRemovedCacheItemCallback
 * @param {string} key
 */

/**
 * @callback onEachStorageItemsCallback
 * @param {*}      value
 * @param {string} key
 */

/**
 * @callback onContainsStorageItemsCallback
 * @param {boolean} contained
 * @param {string}  key
 */

/**
 * @typedef storage
 * @type {{set, remove, each, contains, onChanged, onSet, onAdded, onRemoved}}
 */
var storage = (function () {
    "use strict";
    var listeners = {};

    chrome.storage.onChanged.addListener(function (changes, namespace) {
        var eachChange, eachListenerMatch, regExp, i, eachCallback;

        if (namespace !== 'local') {
            return;
        }
        for (eachChange in changes) {
            if (!changes.hasOwnProperty(eachChange)) {
                continue;
            }

            for (eachListenerMatch in listeners) {
                if (!listeners.hasOwnProperty(eachListenerMatch)) {
                    continue;
                }

                regExp = new RegExp(eachListenerMatch.replace('*', '.*'))
                if (!regExp.test(eachChange)) {
                    continue;
                }

                for (i = 0; i < listeners[eachListenerMatch].length; i += 1) {
                    eachCallback = listeners[eachListenerMatch][i];
                    eachCallback(changes[eachChange], eachChange);
                }
            }
        }
    });

    /**
     * @lends storage
     */
    return {
        /**
         * @param {string} key
         * @param {*}      value
         */
        set: function (key, value) {
            var item  = {};
            item[key] = value;
            chrome.storage.local.set(item);
        },
        /**
         * @param {string} key
         */
        remove: function (key) {
            chrome.storage.local.remove(key);
        },
        /**
         * @param {string}                    match - Use a * for a wildcard
         * @param {onEachStorageItemsCallback} callback
         */
        each: function (match, callback) {
            if (match.indexOf('*') === -1) {
                chrome.storage.local.get(match, function (storage) {
                    if (storage.hasOwnProperty(match)) {
                        callback(storage[match], match);
                    }
                });
                return;
            }

            chrome.storage.local.get(null, function (storage) {
                var each, regExpr = new RegExp(match.replace('*', '.*'));
                for (each in storage) {
                    if (storage.hasOwnProperty(each) && regExpr.test(each)) {
                        callback(storage[each], each);
                    }
                }
            });
        },
        /**
         * @param {string}                         match - No wildcards allowed
         * @param {onContainsStorageItemsCallback} callback
         */
        contains: function (match, callback) {
            if (match.indexOf('*') === -1) {
                chrome.storage.local.get(match, function (storage) {
                    if (storage.hasOwnProperty(match)) {
                        callback(true, match);
                    } else {
                        callback(false, match);
                    }
                });
                return;
            }

            throw new Error('No wildcards allowed');
        },
        /**
         * @param {string}                     match - Use a * for a wildcard
         * @param {onChangedCacheItemCallback} callback
         */
        onChanged: function (match, callback) {
            if (!listeners.hasOwnProperty(match)) {
                listeners[match] = [];
            }
            listeners[match].push(function (change, key) {
                if (change.oldValue !== undefined && change.newValue !== undefined) {
                    callback(change.newValue, key);
                }
            });
        },
        /**
         * @param {string}                     match - Use a * for a wildcard
         * @param {onChangedCacheItemCallback} callback
         */
        onSet: function (match, callback) {
            if (!listeners.hasOwnProperty(match)) {
                listeners[match] = [];
            }

            listeners[match].push(function (change, key) {
                callback(change.newValue, key);
            });
        },
        /**
         * @param {string}                     match - Use a * for a wildcard
         * @param {onChangedCacheItemCallback} callback
         */
        onAdded: function (match, callback) {
            if (!listeners.hasOwnProperty(match)) {
                listeners[match] = [];
            }

            listeners[match].push(function (change, key) {
                if (change.oldValue === undefined) {
                    callback(change.newValue, key);
                }
            });
        },
        /**
         * @param {string}                     match - Use a * for a wildcard
         * @param {onRemovedCacheItemCallback} callback
         */
        onRemoved: function (match, callback) {
            if (!listeners.hasOwnProperty(match)) {
                listeners[match] = [];
            }

            listeners[match].push(function (change, key) {
                if (change.newValue === undefined) {
                    callback(key);
                }
            });
        }
    };
}());
