/**
 * @typedef logging_on_work_package_factory
 * @param {logging}   logging
 * @param {jQuery}    $
 */
var logging_on_work_package_factory = (function (logging, $) {
    "use strict";

    /**
     * @class logging_on_work_package
     */
    return function (pathname) {
        var regExp = /^\/work_packages\/(\d+)$/,
            ticketNumber;

        if (!regExp.test(pathname)) {
            return {modifyHtml: function () {}, loadData: function () {}, addEventListeners: function () {}};
        }

        ticketNumber = regExp.exec(pathname)[1];

        /**
         * @lends logging_on_work_package
         */
        return {
            modifyHtml: function () {
                $('.action_menu_specific')
                    .prepend('<li><a style="width: 2em;" href="#" class="icon fa fa-fw fa-play logging"></a></li>')
                    .prepend('<li><span style="width: 5em;" class="icon fa fa-fw fa-clock-o runner"></span></li>');
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
                    });

                    logging.each(function (ticket) {
                        var $runner = $('.runner');
                        $runner.runner({
                            autostart: true,
                            startAt: ticket.duration,
                            format: formatFunction
                        });

                        if (!ticket.running) {
                            $runner.runner('stop');
                            return;
                        }
                        $('.logging').removeClass('fa-play').addClass('fa-pause');
                    }, ticketNumber);
                });
            },
            addEventListeners: function () {
                logging.onStarted(function () {
                    $('.runner').runner('start');
                    $('.logging').removeClass('fa-play').addClass('fa-pause');
                }, ticketNumber);

                logging.onResumed(function () {
                    $('.runner').runner('start');
                    $('.logging').removeClass('fa-play').addClass('fa-pause');
                }, ticketNumber);

                logging.onStopped(function () {
                    $('.runner').runner('stop');
                    $('.logging').removeClass('fa-pause').addClass('fa-play');
                }, ticketNumber);

                logging.onRemoved(function () {
                    $('.runner').runner('reset', true);
                    $('.logging').removeClass('fa-pause').addClass('fa-play');
                }, ticketNumber);

                $('.logging').on('click', function (event) {
                    var $this = $(this);
                    event.preventDefault();

                    if ($this.hasClass('fa-play')) {
                        logging.start(ticketNumber);
                        return;
                    }
                    logging.stop(ticketNumber);
                });
            }
        };
    };
}(logging, jQuery));
