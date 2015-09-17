/**
 * This file adds the ability to save a logged time.
 *
 * It handles elements matching `a.save` that has an `data-id` (the ticket number).
 *
 * E.g.:
 *  <a href="#" class="save fa fa-fw fa-save" data-id="3749"></a>
 */
$(function () {
    "use strict";

    $(document).on('click', 'a.save', function (event) {
        event.preventDefault();
        logging.stop($(this).data('id'));
        window.open(this.href);
    });
});