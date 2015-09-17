$(function () {
    "use strict";

    settings.onSetBaseUrl(function (url) {
        settings.onSetTimeFormat(function (format) {
            var startedLogging,
                removedLogging,
                stoppedLogging,
                resumedLogging,
                formatter;


            formatter = format === 'hours'
                ? function (dateInMs) {
                    var date    = new Date(dateInMs),
                        minutes = Math.round((date.getUTCMinutes() / 60) * 100);
                    return date.getUTCHours() + '.' + (minutes < 10 ? '0' + minutes : minutes) + 'h';
                }
                    : function (dateInMs) {
                    var date = new Date(dateInMs);
                    return date.getUTCHours() + 'h ' + date.getUTCMinutes() + 'm';
                };

            startedLogging  = function (ticket) {
                var $runner;

                $('#logs_table').append(
                    '<tr id="log_' + ticket.number + '">'
                        + '<td><a class="ticket_number" href="' + url + '/work_packages/' + ticket.number + '">#' + ticket.number + '</a></td>'
                        + '<td>' + ticket.text + '</td>'
                        + '<td><span class="fa fa-fw fa-clock-o"></span> <span id="runner_' + ticket.number + '"></span></td>'
                        + '<td><a href="#" class="log fa fa-fw fa-play" data-id="' + ticket.number + '"></span></a></td>'
                        + '<td><a href="' + url + '/work_packages/' + ticket.number + '/time_entries/new" class="save fa fa-fw fa-save" data-id="' + ticket.number + '"></span></a></td>'
                        + '<td><a href="#" class="trash fa fa-fw fa-trash" data-id="' + ticket.number + '"></span></a></td>'
                        + '<td><a href="#" class="favorite fa fa-fw fa-star" data-id="' + ticket.number + '"></span></a></td>'
                        + '</tr>'
                );

                $runner = $('#runner_' + ticket.number);
                $runner.runner({
                    autostart: true,
                    startAt: ticket.duration,
                    format: formatter
                });

                if (ticket.running) {
                    $('#log_' + ticket.number + ' .log').removeClass('fa-play').addClass('fa-pause');
                    return;
                }

                $runner.runner('stop');
            };
            removedLogging = function (ticketNumber) {
                $('#log_' + ticketNumber).remove();
            };
            resumedLogging = function (ticket) {
                $('#runner_' + ticket.number).runner('start');
                $('#log_' + ticket.number + ' .log').removeClass('fa-play').addClass('fa-pause');
            };
            stoppedLogging = function (ticket) {
                $('#runner_' + ticket.number).runner('stop');
                $('#log_' + ticket.number + ' .log').removeClass('fa-pause').addClass('fa-play');
            };

            logging.each(startedLogging);
            logging.onStarted(startedLogging);
            logging.onResumed(resumedLogging);
            logging.onStopped(stoppedLogging);
            logging.onRemoved(removedLogging);
        });
    });

    favorites.onAdded(function (ticket) {
        $('#log_' + ticket.number + ' .favorite').removeClass('fa-star-o').addClass('fa-star');
    });
    favorites.onRemoved(function (ticketNumber) {
        $('#log_' + ticketNumber + ' .favorite').removeClass('fa-star').addClass('fa-star-o');
    });
    $('.start_logging_form').on('submit', function (event) {
        console.log('submitted');
        event.preventDefault();
        logging.start($('#input_ticket_number').val());
    });
});

