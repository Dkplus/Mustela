logging.all(function (workPackages) {
    "use strict";
    var i, $ul;
    $ul = $('ul');

    for (i in workPackages) {
        if (! workPackages.hasOwnProperty(i)) {
            continue;
        }
        $ul.append('<li>' + workPackages[i].name + '</li>');
    }
    logging.clearAll(function () {});
});