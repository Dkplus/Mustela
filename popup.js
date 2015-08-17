logging.all(function (workPackages) {
    "use strict";
    var i, $logs, $resumeLogging, $stopLogging, $pauseLogging;
    $logs = $('#logs');

    for (i in workPackages) {
        if (! workPackages.hasOwnProperty(i)) {
            continue;
        }
        $logs.append(
            '<tr><td>' + workPackages[i].name + '</td>'
            + '<td id="runner_' + workPackages[i].id + '"></td>'
            + '<td><a style="display: none;" href="#" id="resume-logging-' + workPackages[i].id + '" class="icon fa fa-play resume-logging"></a></td>'
            + '<td><a style="display: none;" href="#" id="pause-logging-' + workPackages[i].id + '" class="icon fa fa-pause pause-logging"></a></td>'
            + '<td><a style="display: none;" href="#" id="stop-logging-' + workPackages[i].id + '" class="icon fa fa-stop stop-logging"></a></td>'
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

        $resumeLogging = $('#resume-logging-' + workPackages[i].id);
        $stopLogging   = $('#stop-logging-' + workPackages[i].id);
        $pauseLogging  = $('#pause-logging-' + workPackages[i].id);

        if (workPackages[i].running) {
            $pauseLogging.show();
        } else {
            $resumeLogging.show();
        }
        $stopLogging.show();
        $resumeLogging.on('click', function (event) {
            "use strict";
            event.preventDefault();
            logging.start(workPackages[i].id, workPackages[i].name, function () {
                $('#runner_' + workPackages[i].id).runner('start');
                $('#resume-logging-' + workPackages[i].id).hide();
                $('#pause-logging-' + workPackages[i].id).show();
            });
        });
        $pauseLogging.on('click', function (event) {
            "use strict";
            event.preventDefault();
            logging.stop(workPackages[i].id, function () {
                $('#runner_' + workPackages[i].id).runner('stop');
                $('#resume-logging-' + workPackages[i].id).show();
                $('#pause-logging-' + workPackages[i].id).hide();
            });
        });
        $stopLogging.on('click', function (event) {
            "use strict";
            event.preventDefault();
            logging.stop(workPackages[i].id, function () {
                $('#runner_' + workPackages[i].id).runner('stop');
                $('#resume-logging-' + workPackages[i].id).show();
                $('#pause-logging-' + workPackages[i].id).hide();
                window.open('https://openproject.atino.net/work_packages/' + workPackages[i].id + '/time_entries/new');
            });
        });
    }
});
