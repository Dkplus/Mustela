/**
 * @callback setBaseUrlCallback
 * @param {string} baseUrl
 */

/**
 * @callback setTimeFormatCallback
 * @param {string} timeFormat One of `hours` and `hours_and_minutes`
 */

/**
 * @typedef settings
 * @type {{setBaseUrl, onSetBaseUrl, setTimeFormat, onSetTimeFormat}}
 * @param {storage} storage
 */
var settings = (function (storage) {
    "use strict";
    var onSet = function (key, callback) {
            key = 'option_' + key;
            storage.each(key, callback);
            storage.onSet(key, callback);
        },
        onSetOnce = function (key, callback) {
            key = 'option_' + key;
            storage.each(key, callback);
        },
        set = function (key, value) {
            storage.set('option_' + key, value);
        };

    /**
     * @lends settings
     */
    return {
        /**
         * @param {string} value
         */
        setBaseUrl: function (value) {
            if (value.substr(value.length - 1) !== '/') {
                value += '/';
            }
            set('base_url', value);
        },
        /**
         * @param {setBaseUrlCallback} callback
         */
        onSetBaseUrl: function (callback) {
            onSet('base_url', callback);
        },
        /**
         * @param {setBaseUrlCallback} callback
         */
        baseUrl: function (callback) {
            onSetOnce('base_url', callback);
        },
        /**
         * @param {string} format One of `hours` and `hours_and_minutes`
         */
        setTimeFormat: function (format) {
            if (format !== 'hours' && format !== 'hours_and_minutes') {
                throw new Error('Invalid time format: ' + format);
            }
            set('time_format', format);
        },
        /**
         * @param {setTimeFormatCallback} callback
         */
        onSetTimeFormat: function (callback) {
            onSet('time_format', callback);
        }
    };
}(storage));
