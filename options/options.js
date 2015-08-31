$(function () {
    "use strict";
    settings.onSetBaseUrl(function (value) {
        $('#base-url').val(value);
    });
    settings.onSetTimeFormat(function (value) {
        $('#time-format').val(value);
    });
    $('#options').on('submit', function (event) {
        event.preventDefault();
        settings.setBaseUrl($('#base-url').val());
        settings.setTimeFormat($('#time-format').val());
    });
});
