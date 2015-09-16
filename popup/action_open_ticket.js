/**
 * This file adds the ability to open the work package links in a new window.
 */
$(function () {
    "use strict";

    $(document).on('click', 'a.ticket_number', function (event) {
        event.preventDefault();
        window.open(this.href);
    });
});