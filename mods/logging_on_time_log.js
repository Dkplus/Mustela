/**
 * @typedef logging_on_time_log_factory
 * @param {logging} logging
 * @param {jQuery}  $
 */
var logging_on_time_log_factory = (function (logging, $) {
    "use strict";

    /**
     * @class logging_on_time_log
     */
    return function (pathname) {
        var regExp = /^\/work_packages\/(\d+)\/time_entries\/new$/,
            ticketNumber;

        if (!regExp.test(pathname)) {
            return {modifyHtml: function () {}, loadData: function () {}, addEventListeners: function () {}};
        }

        ticketNumber = regExp.exec(pathname)[1];

        /**
         * @lends logging_on_time_log
         */
        return {
            modifyHtml: function () {
            },
            loadData: function () {
                logging.each(function (ticket) {
                    var date = new Date(ticket.duration),
                        minutes = Math.round((date.getUTCMinutes() / 60) * 100);
                    $('#time_entry_hours').val(date.getUTCHours() + '.' + (minutes < 10 ? '0' + minutes : minutes));
                }, ticketNumber);
            },
            addEventListeners: function () {
                $('#new_time_entry').on('submit', function () {
                    logging.remove(ticketNumber);
                });
            }
        };
    };
}(logging, jQuery));
