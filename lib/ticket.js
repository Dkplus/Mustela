/**
 * @typedef ticket
 * @constructs ticket
 * @param {Number} number
 * @param {string} text
 * @param {boolean} running
 * @param {Number} duration in milliseconds
 * @returns {{number: Number, text: string, running: boolean, duration: Number}}
 */
var ticket = function (number, text, running, duration) {
    "use strict";

    /**
     * @lends ticket
     */
    return {
        number: number,
        text: text,
        running: (running || false),
        duration: (duration || 0)
    };
};
