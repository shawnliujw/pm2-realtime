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

PM2.listProcesses = function () {
    return PM2.connect()
        .then(function () {
            return pm2Instance.list();
        })
}
_convertToPromise();
module.exports = PM2;
