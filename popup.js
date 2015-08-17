logging.all(function (workPackages) {
    "use strict";
    var i, $logs;
    $logs = $('#logs');

    for (i in workPackages) {
        if (! workPackages.hasOwnProperty(i)) {
            continue;
        }
        $logs.append(
            '<tr><td>' + workPackages[i].name + '</td>'
            + '<td id="runner_' + workPackages[i].id + '"></td>'
            + '<td><a data-id="' + workPackages[i].id + '" style="display: none;" href="#" id="resume-logging-' + workPackages[i].id + '" class="icon fa fa-play resume-logging"></a></td>'
            + '<td><a data-id="' + workPackages[i].id + '" style="display: none;" href="#" id="pause-logging-' + workPackages[i].id + '" class="icon fa fa-pause pause-logging"></a></td>'
            + '<td><a data-id="' + workPackages[i].id + '" style="display: none;" href="#" id="stop-logging-' + workPackages[i].id + '" class="icon fa fa-stop stop-logging"></a></td>'
            + '<td><a data-id="' + workPackages[i].id + '" href="#" id="remove-logging-' + workPackages[i].id + '" class="icon fa fa-trash-o remove-logging"></a></td>'
            + '</tr>');

        $('#runner_' + workPackages[i].id).runner({
            autostart: workPackages[i].running,
            startAt: workPackages[i].time * 1000,
            format: function (dateInMs) {
                var date = new Date(dateInMs),
                    minutes = Math.round((date.getUTCMinutes()/60) * 100);
                return date.getUTCHours() + '.' + (minutes < 10 ? '0' + minutes : minutes) + ' h';
            }
        });

        if (workPackages[i].running) {
            $('#pause-logging-' + workPackages[i].id).show();
        } else {
            $('#resume-logging-' + workPackages[i].id).show();
        }
        $('#stop-logging-' + workPackages[i].id).show();
    }

    $('.resume-logging').on('click', function (event) {
        "use strict";
        var id = $(this).data('id');
        event.preventDefault();
        logging.start(id, '', function () {
            $('#runner_' + id).runner('start');
            $('#resume-logging-' + id).hide();
            $('#pause-logging-' + id).show();
        });
    });
    $('.pause-logging').on('click', function (event) {
        "use strict";
        var id = $(this).data('id');
        event.preventDefault();
        logging.stop(id, function () {
            $('#runner_' + id).runner('stop');
            $('#resume-logging-' + id).show();
            $('#pause-logging-' + id).hide();
        });
    });
    $('.stop-logging').on('click', function (event) {
        "use strict";
        var id = $(this).data('id');
        event.preventDefault();
        logging.stop(id, function () {
            $('#runner_' + id).runner('stop');
            $('#resume-logging-' + id).show();
            $('#pause-logging-' + id).hide();
            window.open('https://openproject.atino.net/work_packages/' + id + '/time_entries/new');
        });
    });
    $('.remove-logging').on('click', function (event) {
        "use strict";
        var id = $(this).data('id');
        event.preventDefault();
        logging.clear(id, function () {
            $('#remove-logging-' + id).parent().parent().remove();
        });
    });
});
