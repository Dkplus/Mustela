$(function () {
    "use strict";
    var factories = [
        favorites_on_work_package_factory,
        logging_on_work_package_factory,
        logging_on_time_log_factory,
    ];

    settings.onSetBaseUrl(function (baseUrl) {
        var i, modifier;

        if (window.location.href.indexOf(baseUrl) !== 0) {
            return;
        }
        for (i = 0; i < factories.length; i += 1) {
            modifier = factories[i](window.location.pathname);
            if (!modifier) {
                continue;
            }
            modifier.modifyHtml();
            modifier.loadData();
            modifier.addEventListeners();
        }
    });
});
