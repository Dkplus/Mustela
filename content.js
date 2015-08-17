$(function() {
    var workPackageId,
        workPackageName,
        regExp = /^\/work_packages\/(\d+)$/,
        logRegExp = /^\/work_packages\/(\d+)\/time_entries\/new$/,
        fa,
        paused,
        running,
        neverRan,
        insertLoggingTime;

    fa = document.createElement('style');
    fa.type = 'text/css';
    fa.textContent = '@font-face { font-family: FontAwesome; src: url("'
        + chrome.extension.getURL('lib/fa/fonts/fontawesome-webfont.woff?v=4.4.0')
        + '"); }';
    document.head.appendChild(fa);

    if (logRegExp.test(window.location.pathname)) {
        workPackageId = logRegExp.exec(window.location.pathname)[1];

        insertLoggingTime = function (id, durationInSeconds) {
            var date = new Date(durationInSeconds * 1000),
                minutes = Math.round((date.getUTCMinutes()/60) * 100);
            $('#time_entry_hours').val(date.getUTCHours() + '.' + (minutes < 10 ? '0' + minutes : minutes));
            $('#new_time_entry').on('submit', function () {
                logging.clear(id, function () {});
            });
        };
        logging.running(workPackageId, function () {}, insertLoggingTime, function () {});
    }

    if (!regExp.test(window.location.pathname)) {
        return;
    }

    workPackageId   = regExp.exec(window.location.pathname)[1];
    workPackageName = $('h2').text();

    $('.action_menu_specific')
        .prepend('<li style="display: none;"><a href="#" class="icon fa fa-stop stop-logging">Stop &amp; log</a></li>')
        .prepend('<li style="display: none;"><a href="#" class="icon fa fa-pause pause-logging">Pause</a></li>')
        .prepend('<li style="display: none;"><a href="#" class="icon fa fa-play resume-logging">Resume</a></li>')
        .prepend('<li style="display: none;"><a href="#" class="icon fa fa-play start-logging">Start</a></li>')
        .prepend('<li><span class="icon fa fa-clock-o runner"></span></li>');

    paused = function (id, durationInSeconds) {
        "use strict";
        var $runner = $('.runner');
        $('.start-logging').parent().hide();
        $('.pause-logging').parent().hide();
        $('.stop-logging').parent().show();
        $('.resume-logging').parent().show();
        if ($runner.runner('info').hasOwnProperty('running')) {
            $runner.runner('stop');
            return;
        }
        $runner.runner({
            autostart: false,
            startAt: durationInSeconds * 1000,
            format: function (dateInMs) {
                var date = new Date(dateInMs),
                    minutes = Math.round((date.getUTCMinutes()/60) * 100);
                return date.getUTCHours() + '.' + (minutes < 10 ? '0' + minutes : minutes) + ' h';
            }
        });
    };
    running = function (id, durationInSeconds) {
        "use strict";
        var $runner = $('.runner');
        $('.start-logging').parent().hide();
        $('.resume-logging').parent().hide();
        $('.stop-logging').parent().show();
        $('.pause-logging').parent().show();

        if ($runner.runner('info').hasOwnProperty('running')) {
            $runner.runner('start');
            return;
        }
        $runner.runner({
            autostart: true,
            startAt: durationInSeconds * 1000,
            format: function (dateInMs) {
                var date = new Date(dateInMs),
                    minutes = Math.round((date.getUTCMinutes()/60) * 100);
                return date.getUTCHours() + '.' +  (minutes < 10 ? '0' + minutes : minutes) + ' h';
            }
        });
    };
    neverRan = function () {
        "use strict";
        $('.resume-logging').parent().hide();
        $('.pause-logging').parent().hide();
        $('.stop-logging').parent().hide();
        $('.runner').text('0.0 h');
        $('.start-logging').parent().show();
    };

    $('.resume-logging').on('click', function (event) {
        "use strict";
        event.preventDefault();
        logging.start(workPackageId, workPackageName, running);
    });
    $('.pause-logging').on('click', function (event) {
        "use strict";
        event.preventDefault();
        logging.stop(workPackageId, paused);
    });
    $('.stop-logging').on('click', function (event) {
        "use strict";
        event.preventDefault();
        logging.stop(workPackageId, function () {
            window.location.href = window.location.href + '/time_entries/new';
        });
    });
    $('.start-logging').on('click', function (event) {
        "use strict";
        event.preventDefault();
        logging.start(workPackageId, workPackageName, running);
    });

    logging.running(
        workPackageId,
        running,
        paused,
        neverRan
    );
});

