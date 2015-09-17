$(function () {
    "use strict";

    settings.onSetBaseUrl(function (url) {
        var addTicketToHistory,
            removeTicketFromHistory;

        addTicketToHistory = function (ticket) {
            if ($('#recent_' + ticket.number).length > 0) {
                return;
            }
            $('#recent_table').append(
                '<tr id="recent_' + ticket.number + '">'
                    + '<td><a class="ticket_number" href="' + url + '/work_packages/' + ticket.number + '">#' + ticket.number + '</a></td>'
                    + '<td>' + ticket.text + '</td>'
                    + '<td><a href="#" class="log fa fa-fw fa-play" data-id="' + ticket.number + '"></span></a></td>'
                    + '<td><a href="#" class="favorite fa fa-fw fa-star-o" data-id="' + ticket.number + '"></span></a></td>'
                    + '</tr>'
            );

            favorites.each(function (ticket) {
                $('#recent_' + ticket.number + ' .favorite').removeClass('fa-star-o').addClass('fa-star');
            }, ticket.number);
            logging.each(function (ticket) {
                if (ticket.running) {
                    $('#recent_' + ticket.number + ' .log').removeClass('fa-play').addClass('fa-pause');
                }
            }, ticket.number);
        };
        removeTicketFromHistory = function (ticketNumber) {
            $('#recent_' + ticketNumber).remove();
        };

        ticketHistory.each(addTicketToHistory);
        ticketHistory.onAdded(addTicketToHistory);
        ticketHistory.onRemoved(removeTicketFromHistory);
    });

    favorites.onAdded(function (ticket) {
        $('#recent_' + ticket.number + ' .favorite').removeClass('fa-star-o').addClass('fa-star');
    });
    favorites.onRemoved(function (ticketNumber) {
        $('#recent_' + ticketNumber + ' .favorite').removeClass('fa-star').addClass('fa-star-o');
    });
    logging.onStarted(function (ticket) {
        $('#recent_' + ticket.number + ' .log').removeClass('fa-play').addClass('fa-pause');
    });
    logging.onResumed(function (ticket) {
        $('#recent_' + ticket.number + ' .log').removeClass('fa-play').addClass('fa-pause');
    });
    logging.onStopped(function (ticket) {
        $('#recent_' + ticket.number + ' .log').removeClass('fa-pause').addClass('fa-play');
    });
    logging.onRemoved(function (ticketNumber) {
        $('#recent_' + ticketNumber + ' .log').removeClass('fa-pause').addClass('fa-play');
    });
});
