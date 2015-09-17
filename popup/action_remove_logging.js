/**
 * This file adds the ability to remove a logged time.
 *
 * It handles elements matching `a.trash` that has an `data-id` (the ticket number).
 *
 * E.g.:
 *  <a href="#" class="trash fa fa-fw fa-trash" data-id="3749"></a>
 */
$(function () {
    "use strict";

    $(document).on('click', 'a.trash', function (event) {
        event.preventDefault();
        var $this = $(this);

        logging.remove($this.data('id'));
    });
});