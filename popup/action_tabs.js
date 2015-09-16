$(function () {
    "use strict";
    var $logs = $('#logs'),
        $favorites = $('#favorites'),
        $recent = $('#recent'),
        activateTab;

    activateTab = function () {
        $(this).parents('ul').children().removeClass('active');
        $(this).parent().addClass('active');
    };

    $('#logs_link').on('click', function (event) {
        event.preventDefault();
        activateTab.apply(this);
        $logs.show();
        $favorites.hide();
        $recent.hide();
    });
    $('#favorites_link').on('click', function (event) {
        event.preventDefault();
        activateTab.apply(this);
        $logs.hide();
        $favorites.show();
        $recent.hide();
    });
    $('#recent_link').on('click', function (event) {
        event.preventDefault();
        activateTab.apply(this);
        $logs.hide();
        $favorites.hide();
        $recent.show();
    });
});
