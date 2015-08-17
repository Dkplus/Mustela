var logging = (function () {
    "use strict";
    var startLogging,
        resumeLogging,
        stopLogging,
        calculateLoggedTime;

    calculateLoggedTime = function (logs) {
        var i, start, end, durationInSeconds = 0;
        for (i = 0; i < logs.length; i += 2) {
            start = logs[i];
            end   = logs.length === i+1 ? new Date().getTime() : logs[i+1];
            durationInSeconds += (end - start) / 1000;
        }
        return Math.round(durationInSeconds);
    };

    startLogging = function (id, name, callback) {
        var storage = {}, internalCallback;
        storage['ticket_' + id] = {
            id: id,
            name: name,
            logs: [new Date().getTime()]
        };
        internalCallback = function () {
            callback(id, 0);
        };
        chrome.storage.local.set(storage, internalCallback);
    };

    resumeLogging = function (id, storage, callback) {
        var loggedTime, internalCallback;

        loggedTime = calculateLoggedTime(storage['ticket_' + id].logs);
        internalCallback = function () {
            callback(id, loggedTime);
        };
        if (storage['ticket_' + id].logs.length % 2 !== 0) {
            callback(id, loggedTime);
            return;
        }
        storage['ticket_' + id].logs.push(new Date().getTime());
        chrome.storage.local.set(storage, internalCallback);
    };

    stopLogging = function (id, storage, callback) {
        var internalCallback, durationInSeconds = 0;

        if (storage['ticket_' + id].logs.length % 2 !== 0) {
            storage['ticket_' + id].logs.push(new Date().getTime());
        }
        durationInSeconds = calculateLoggedTime(storage['ticket_' + id].logs);

        internalCallback = function () {
            callback(id, durationInSeconds);
        };
        chrome.storage.local.set(storage, internalCallback);
    };

    return {
        start: function (id, name, callback) {
            chrome.storage.local.get('ticket_' + id, function (storage) {
                if (! storage || ! storage.hasOwnProperty('ticket_' + id)) {
                   startLogging(id, name, callback);
                    return;
                }
                resumeLogging(id, storage, callback);
            });
        },
        stop: function (id, callback, error) {
            chrome.storage.local.get('ticket_' + id, function (storage) {
                if (! storage || ! storage.hasOwnProperty('ticket_' + id)) {
                    error(id);
                    return;
                }
                stopLogging(id, storage, callback);
            });
        },
        clear: function (id, callback) {
            chrome.storage.local.remove('ticket_' + id, callback);
        },
        clearAll: function (callback) {
            chrome.storage.local.clear(callback);
        },
        all: function (callback) {
            chrome.storage.local.get(null, function (storage) {
                var attr, result = [];
                for (attr in storage) {
                    if (storage.hasOwnProperty(attr) && /ticket_\d+/.test(attr)) {
                        storage[attr].running = storage[attr].logs.length % 2 !== 0;
                        storage[attr].time = calculateLoggedTime(storage[attr].logs);
                        result.push(storage[attr]);
                    }
                }
                callback(result);
            });
        },
        running: function (id, runningCallback, hasRanCallback, notRanCallback) {
            chrome.storage.local.get('ticket_' + id, function (storage) {
                if (! storage.hasOwnProperty('ticket_' + id)) {
                    notRanCallback(id);
                    return;
                }
                if (storage['ticket_' + id].logs.length % 2 === 0) {
                    hasRanCallback(id, calculateLoggedTime(storage['ticket_' + id].logs));
                    return;
                }
                runningCallback(id, calculateLoggedTime(storage['ticket_' + id].logs));
            });
        }
    };
})();
