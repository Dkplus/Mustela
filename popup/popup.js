$(function () {
    "use strict";

    // tabs
    var $logs = $('#logs'),
        $favorites = $('#favorites'),
        $recent = $('#recent');

    $('#logs_link').on('click', function (event) {
        event.preventDefault();
        $logs.show();
        $favorites.hide();
        $recent.hide();
    });
    $('#favorites_link').on('click', function (event) {
        event.preventDefault();
        $logs.hide();
        $favorites.show();
        $recent.hide();
    });
    $('#recent_link').on('click', function (event) {
        event.preventDefault();
        $logs.hide();
        $favorites.hide();
        $recent.show();
    });

    // favorites
    favorites.each(function (ticket) {
        console.log(ticket);
        $('#favorites_table').append(
            '<tr><td>' + ticket.text + '<td></tr>'
        );
    });

    // recent
    ticketHistory.each(function (ticket) {
        $('#recent_table').append(
            '<tr><td>' + ticket.text + '</td></tr>'
        );
    });

    settings.onSetBaseUrl(function (url) {


        // tickets
        settings.onSetTimeFormat(function (format) {
            var formatFunction, addTicket;
            formatFunction = format === 'hours'
                ? function (dateInMs) {
                    var date = new Date(dateInMs),
                        minutes = Math.round((date.getUTCMinutes() / 60) * 100);
                    return date.getUTCHours() + '.' +  (minutes < 10 ? '0' + minutes : minutes) + 'h';
                }
                : function (dateInMs) {
                    var date = new Date(dateInMs);
                    return date.getUTCHours() + 'h ' +  date.getUTCMinutes() + 'm';
                };
            addTicket = function (ticket) {
                var $resumeLogging, $pauseLogging, $stopLogging, $favorite;

                $('#logs_table').append(
                    '<tr id="log_' + ticket.number + '"><td><a id="log_text_' + ticket.number + '" href="' + url + '/work_packages/' + ticket.number + '">' + ticket.text + '</a></td>'
                        + '<td id="runner_' + ticket.number + '"></td>'
                        + '<td><a style="display: none;" href="#" id="resume-logging-' + ticket.number + '" class="icon fa fa-play resume-logging"></a></td>'
                        + '<td><a style="display: none;" href="#" id="pause-logging-' + ticket.number + '" class="icon fa fa-pause pause-logging"></a></td>'
                        + '<td><a style="display: none;" href="' + url + '/work_packages/' + ticket.number + '/time_entries/new" id="stop-logging-' + ticket.number + '" class="icon fa fa-stop stop-logging"></a></td>'
                        + '<td><a href="#" id="favorite-' + ticket.number + '" class="icon fa fa-heart-o favorite"></a></td>'
                        + '<td><a href="#" id="remove-logging-' + ticket.number + '" class="icon fa fa-trash-o remove-logging"></a></td>'
                        + '</tr>'
                );

                $resumeLogging = $('#resume-logging-' + ticket.number);
                $pauseLogging  = $('#pause-logging-' + ticket.number);
                $stopLogging   = $('#stop-logging-' + ticket.number);
                $favorite      = $('#favorite-' + ticket.number);

                $('#runner_' + ticket.number).runner({
                    autostart: ticket.running,
                    startAt: ticket.duration,
                    format: formatFunction
                });
                if (ticket.running) {
                    $pauseLogging.show();
                    $stopLogging.show();
                } else {
                    $resumeLogging.show();
                }
                $('#log_text_' + ticket.number).on('click', function (event) {
                    event.preventDefault();
                    window.open(this.href);
                });
                $resumeLogging.on('click', function (event) {
                    event.preventDefault();
                    logging.start(ticket.number, $('#log_text_' + ticket.number).text());
                });
                $pauseLogging.on('click', function (event) {
                    event.preventDefault();
                    logging.stop(ticket.number);
                });
                $stopLogging.on('click', function (event) {
                    event.preventDefault();
                    logging.stop(ticket.number);
                    window.open(this.href);
                });
                $('#remove-logging-' + ticket.number).on('click', function (event) {
                    event.preventDefault();
                    logging.remove(ticket.number);
                });
                favorites.each(function (ticket) {
                    $('#favorite-' + ticket.number).removeClass('fa-heart-o').addClass('fa-heart');
                }, ticket.number);
                $favorite.on('click', function (event) {
                    event.preventDefault();
                    if ($favorite.hasClass('fa-heart-o')) {
                        favorites.add(ticket.number);
                        return;
                    }
                    favorites.remove(ticket.number);
                });
            };
            $('#logs_table').empty();
            logging.each(addTicket);
            logging.onStarted(addTicket);
            logging.onStopped(function (ticket) {
                $('#runner-' + ticket.number).runner('stop');
                $('#pause-logging-' + ticket.number).hide();
                $('#stop-logging-' + ticket.number).hide();
                $('#resume-logging-' + ticket.number).show();
            });
            logging.onRemoved(function (ticketNumber) {
                $('#log_' + ticketNumber).remove();
            });
            logging.onResumed(function (ticket) {
                $('#runner-' + ticket.number).runner('start');
                $('#resume-logging-' + ticket.number).hide();
                $('#pause-logging-' + ticket.number).show();
                $('#stop-logging-' + ticket.number).show();
            });
            favorites.onAdded(function (ticket) {
                $('#favorite-' + ticket.number).removeClass('fa-heart-o').addClass('fa-heart');
            });
            favorites.onRemoved(function (ticketNumber) {
                $('#favorite-' + ticketNumber).removeClass('fa-heart').addClass('fa-heart-o');
            });
        });
    });
});
