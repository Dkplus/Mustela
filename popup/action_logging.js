/**
 * This file adds the ability to start and stop tickets and log the recorded time.
 *
 * It handles elements matching `a.log` that has an `data-id` (the ticket number) and indicates it state through
 * the classes fa-play and fa-pause.
 *
 * E.g.:
 *  <a href="#" class="log fa fa-fw fa-play" data-id="3749"></a>
 */
$(function () {
    "use strict";

    $(document).on('click', 'a.log', function (event) {
        event.preventDefault();
        var $this = $(this);

        if ($this.hasClass('fa-play')) {
            logging.start($this.data('id'));
            return;
        }

        logging.stop($this.data('id'));
    });
});