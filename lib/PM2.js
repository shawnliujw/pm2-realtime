/**
 * Created by Shawn Liu on 2014/12/19.
 */

var Promise = require("bluebird");
var pm2Instance = require("pm2");
var logger = require("log4js").getLogger("lib/PM2.js");
var _ = require("lodash");
var connected = false;
var PM2 = {};

var _convertToPromise = function () {
    for (var key in pm2Instance) {
        if (typeof pm2Instance[key] === "function") {
            pm2Instance[key] = Promise.promisify(pm2Instance[key]);
        }
    }
}

var _connect = function () {
    if (connected) {
        logger.info("Reuse PM2 connection");
        return Promise.resolve();
    } else {
        return pm2Instance.connect()
            .then(function () {
                connected = true;
                logger.info("Connected to pm2", new Date());
            });
    }
}

PM2.connect = function () {
    return _connect();
}
PM2.disconnect = function () {
    return pm2Instance.disconnect();
}

PM2.streamLogs = function () {
    PM2.connect()
        .then(pm2Instance.ilogs)
        .then(pm2Instance.streamLogs);
}

PM2.reload = function (processName) {
    return PM2.connect().then(function () {
        return pm2Instance.reload(processName);
    });
}
PM2.restart = function (processName) {
    return PM2.connect().then(function () {
        return pm2Instance.restart(processName);
    });
}
PM2.stop = function (processName) {
    return PM2.connect().then(function () {
        return pm2Instance.stop(processName);
    });
}
PM2.reloadLogs = function () {
    return PM2.connect().then(function () {
        return pm2Instance.reloadLogs;
    });
}
PM2.flush = function () {
    return PM2.connect().then(function () {
        return pm2Instance.flush;
    });
}
PM2.listProcesses = function () {
    return PM2.connect()
        .then(function () {
            return pm2Instance.jlist();
        })
}

PM2.monitor = function (processName, fn) {
    pm2Instance.monit()
        .then(function (msg) {
            logger.info(msg);
        });
}

_convertToPromise();
module.exports = PM2;
