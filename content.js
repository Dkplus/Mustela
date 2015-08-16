$(function() {
    var workPackageId,
        workPackageName,
        regExp = /^\/work_packages\/(\d+)$/,
        fa,
        paused,
        running,
        neverRan;

    if (!regExp.test(window.location.pathname)) {
        return;
    }

    fa = document.createElement('style');
    fa.type = 'text/css';
    fa.textContent = '@font-face { font-family: FontAwesome; src: url("'
        + chrome.extension.getURL('lib/fa/fonts/fontawesome-webfont.woff?v=4.4.0')
        + '"); }';
    document.head.appendChild(fa);

    workPackageId   = regExp.exec(window.location.pathname)[1];
    workPackageName = $('h2').text();

    $('.action_menu_specific').prepend('<li><a href="#" class="icon fa fa-stop stop-logging" style="display: none;">Stop</a></li>');
    $('.action_menu_specific').prepend('<li><a href="#" class="icon fa fa-pause pause-logging" style="display: none;">Pause</a></li>');
    $('.action_menu_specific').prepend('<li><a href="#" class="icon fa fa-play resume-logging" style="display: none;">Resume</a></li>');
    $('.action_menu_specific').prepend('<li><a href="#" class="icon fa fa-play start-logging" style="display: none;">Start</a></li>');


    paused = function () {
        "use strict";
        $('.start-logging').hide();
        $('.pause-logging').hide();
        $('.stop-logging').show();
        $('.resume-logging').show();
    };
    running = function () {
        "use strict";
        $('.start-logging').hide();
        $('.resume-logging').hide();
        $('.stop-logging').show();
        $('.pause-logging').show();
    };
    neverRan = function () {
        "use strict";
        $('.resume-logging').hide();
        $('.pause-logging').hide();
        $('.stop-logging').hide();
        $('.start-logging').show();
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
        logging.stop(workPackageId, neverRan);
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

