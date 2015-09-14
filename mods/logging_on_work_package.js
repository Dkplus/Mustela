/**
 * @typedef logging_on_work_package_factory
 * @param {logging}   logging
 * @param {jQuery}    $
 */
var logging_on_work_package_factory = (function (logging, $) {
    "use strict";
    var showStopButton, showPauseButton, showResumeButton, showStartButton,
        hideStopButton, hidePauseButton, hideResumeButton, hideStartButton,
        startRunner, stopRunner, stopAndResetRunner;

    showPauseButton    = function () { $('.pause-logging').parent().show(); };
    hidePauseButton    = function () { $('.pause-logging').parent().hide(); };
    showStopButton     = function () { $('.stop-logging').parent().show(); };
    hideStopButton     = function () { $('.stop-logging').parent().hide(); };
    showResumeButton   = function () { $('.resume-logging').parent().show(); };
    hideResumeButton   = function () { $('.resume-logging').parent().hide(); };
    showStartButton    = function () { $('.start-logging').parent().show(); };
    hideStartButton    = function () { $('.start-logging').parent().hide(); };
    stopAndResetRunner = function () { $('.runner').runner('reset', true).hide(); };
    startRunner        = function () { $('.runner').show().runner('start'); };
    stopRunner         = function () { $('.runner').runner('stop'); };

    /**
     * @class logging_on_work_package
     */
    return function (pathname) {
        var regExp = /^\/work_packages\/(\d+)$/,
            ticketNumber,
            ticketText;

        if (!regExp.test(pathname)) {
            return {modifyHtml: function () {}, loadData: function () {}, addEventListeners: function () {}};
        }

        ticketNumber = regExp.exec(pathname)[1];
        ticketText   = $('h2').text();

        /**
         * @lends logging_on_work_package
         */
        return {
            modifyHtml: function () {
                $('.action_menu_specific')
                    .prepend('<li style="display: none;"><a href="#" class="icon fa fa-stop stop-logging">Stop &amp; log</a></li>')
                    .prepend('<li style="display: none;"><a href="#" class="icon fa fa-pause pause-logging">Pause</a></li>')
                    .prepend('<li style="display: none;"><a href="#" class="icon fa fa-play resume-logging">Resume</a></li>')
                    .prepend('<li><a href="#" class="icon fa fa-play start-logging">Start</a></li>')
                    .prepend('<li><span class="icon fa fa-clock-o runner"></span></li>');
            },
            loadData: function () {
                settings.onSetTimeFormat(function (format) {
                    var formatFunction = format === 'hours'
                        ? function (dateInMs) {
                            var date = new Date(dateInMs),
                                minutes = Math.round((date.getUTCMinutes() / 60) * 100);
                            return date.getUTCHours() + '.' +  (minutes < 10 ? '0' + minutes : minutes) + 'h';
                        }
                        : function (dateInMs) {
                            var date = new Date(dateInMs);
                            return date.getUTCHours() + 'h ' +  date.getUTCMinutes() + 'm';
                        };
                    $('.runner').runner({
                        startAt: 0,
                        format: formatFunction
                    }).hide();

                    logging.each(function (ticket) {
                        $('.runner').runner({
                            startAt: ticket.duration,
                            format: formatFunction
                        }).show();

                        if (!ticket.running) {
                            if (ticket.duration > 0) {
                                showResumeButton();
                                hideStartButton();
                            }
                            return;
                        }

                        startRunner();
                        hideStartButton();
                        hideResumeButton();
                        showPauseButton();
                        showStopButton();
                    }, ticketNumber);
                });
            },
            addEventListeners: function () {
                logging.onStarted(function () {
                    startRunner();
                    hideStartButton();
                    hideResumeButton();
                    showPauseButton();
                    showStopButton();
                }, ticketNumber);

                logging.onResumed(function () {
                    startRunner();
                    hideStartButton();
                    hideResumeButton();
                    showPauseButton();
                    showStopButton();
                }, ticketNumber);

                logging.onStopped(function () {
                    stopRunner();
                    hideStartButton();
                    showResumeButton();
                    hidePauseButton();
                    hideStopButton();
                }, ticketNumber);

                logging.onRemoved(function () {
                    stopAndResetRunner();
                    showStartButton();
                    hideResumeButton();
                    hidePauseButton();
                    hideStopButton();
                }, ticketNumber);

                $('.resume-logging').on('click', function (event) {
                    event.preventDefault();
                    logging.start(ticketNumber, ticketText);
                });

                $('.pause-logging').on('click', function (event) {
                    event.preventDefault();
                    logging.stop(ticketNumber);
                });

                $('.stop-logging').on('click', function (event) {
                    event.preventDefault();
                    logging.stop(ticketNumber);
                    window.location.pathname = '/work_packages/' + ticketNumber + '/time_entries/new';
                });

                $('.start-logging').on('click', function (event) {
                    event.preventDefault();
                    logging.start(ticketNumber, ticketText);
                });
            }
        };
    };
}(logging, jQuery));
