$(function () {
    "use strict";

    settings.onSetBaseUrl(function (url) {
        var addTicketToFavorites,
            removeTicketFromFavorites;

        addTicketToFavorites = function (ticket) {
            $('#favorites_table').append(
                '<tr id="favorite_' + ticket.number + '">'
                    + '<td><a class="ticket_number" href="' + url + '/work_packages/' + ticket.number + '">#' + ticket.number + '</a></td>'
                    + '<td>' + ticket.text + '</td>'
                    + '<td><a href="#" class="log fa fa-fw fa-play" data-id="' + ticket.number + '"></span></a></td>'
                    + '<td><a href="#" class="favorite fa fa-fw fa-star" data-id="' + ticket.number + '"></span></a></td>'
                    + '</tr>'
            );

            logging.each(function (ticket) {
                if (ticket.running) {
                    $('#favorite_' + ticket.number + ' .log').removeClass('fa-play').addClass('fa-pause');
                }
            }, ticket.number);
        };
        removeTicketFromFavorites = function (ticketNumber) {
            $('#favorite_' + ticketNumber).remove();
        };

        favorites.each(addTicketToFavorites);
        favorites.onAdded(addTicketToFavorites);
        favorites.onRemoved(removeTicketFromFavorites);
    });

    logging.onStarted(function (ticket) {
        $('#favorite_' + ticket.number + ' .log').removeClass('fa-play').addClass('fa-pause');
    });
    logging.onResumed(function (ticket) {
        $('#favorite_' + ticket.number + ' .log').removeClass('fa-play').addClass('fa-pause');
    });
    logging.onStopped(function (ticket) {
        $('#favorite_' + ticket.number + ' .log').removeClass('fa-pause').addClass('fa-play');
    });
    logging.onRemoved(function (ticketNumber) {
        $('#favorite_' + ticketNumber + ' .log').removeClass('fa-pause').addClass('fa-play');
    });
});
