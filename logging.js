var logging = (function () {
    "use strict";
    var startLogging,
        resumeLogging,
        stopLogging;

    startLogging = function (id, name, callback) {
        var storage = {};
        storage['ticket_' + id] = {
            id: id,
            name: name,
            logs: [new Date().getTime()]
        };
        console.log(storage);
        chrome.storage.sync.set(storage, callback);
    };

    resumeLogging = function (id, storage, callback) {
        if (storage['ticket_' + id].logs.length % 2 !== 0) {
            callback();
            return;
        }
        storage['ticket_' + id].logs.push(new Date().getTime());
        chrome.storage.sync.set(storage, callback);
    };

    stopLogging = function (id, storage, callback) {
        var internalCallback, durationInSeconds = 0, i, start, end;

        storage['ticket_' + id].logs.push(new Date().getTime());
        for (i = 0; i < storage['ticket_' + id].logs.length; i += 2) {
            start = storage['ticket_' + id].logs[i];
            end   = storage['ticket_' + id].logs[i+1];
            durationInSeconds += (end - start) / 1000;
        }

        internalCallback = function () {
            callback(durationInSeconds);
        };
        chrome.storage.sync.set(storage, internalCallback);
    };

    return {
        start: function (id, name, callback) {
            chrome.storage.sync.get('ticket_' + id, function (storage) {
                if (! storage || ! storage.hasOwnProperty('ticket_' + id)) {
                   startLogging(id, name, callback);
                    return;
                }
                resumeLogging(id, storage, callback);
            });
        },
        stop: function (id, callback, error) {
            chrome.storage.sync.get('ticket_' + id, function (storage) {
                if (! storage || ! storage.hasOwnProperty('ticket_' + id)) {
                    error(id);
                    return;
                }
                if (storage['ticket_' + id].logs.length % 2 === 0) {
                    error(id);
                    return;
                }

                stopLogging(id, storage, callback);
            });
        },
        clear: function (id, callback) {
            chrome.storage.sync.remove('ticket_' + id, callback);
        },
        clearAll: function (callback) {
            chrome.storage.sync.clear(callback);
        },
        all: function (callback) {
            chrome.storage.sync.get(null, function (storage) {
                var attr, result = [];
                for (attr in storage) {
                    if (storage.hasOwnProperty(attr) && /ticket_\d+/.test(attr)) {
                        result.push(storage[attr]);
                    }
                }
                callback(result);
            });
        },
        running: function (id, runningCallback, hasRanCallback, notRanCallback) {
            chrome.storage.sync.get('ticket_' + id, function (storage) {
                console.log(storage);
                if (! storage.hasOwnProperty('ticket_' + id)) {
                    notRanCallback(id);
                    return;
                }
                if (storage['ticket_' + id].logs.length % 2 === 0) {
                    hasRanCallback(id);
                    return;
                }
                runningCallback(id);
            });
        }
    };
})();