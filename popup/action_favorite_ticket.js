/**
 * This file adds the ability to favorite and unfavorite tickets.
 *
 * It handles elements matching `a.favorite` that has an `data-id` (the ticket number) and indicates it state through
 * the classes fa-star and fa-star-o.
 *
 * E.g.:
 *  <a href="#" class="favorite fa fa-fw fa-star" data-id="3749"></a>
 */
$(function () {
    "use strict";

    $(document).on('click', 'a.favorite', function (event) {
        event.preventDefault();
        var $this = $(this);

        if ($this.hasClass('fa-star')) {
            favorites.remove($this.data('id'));
            return;
        }

        favorites.add($this.data('id'));
    });
});