/**
 * Created by Shawn Liu on 14-12-19.
 */
var Promise = require("bluebird");
var Process = require("child_process");
var logger = require("log4js").getLogger("lib/systemOperate.js");
var pusage = require("pidusage");
var os = require("os");
exports.killProcess = function (pid) {
    return new Promise(function (resolve, reject) {
        var command = "kill -9 " + pid;
        Process.exec(command, function (err, data) {
            if (err) {
                logger.error(err);
                reject(err);
            } else {
                resolve();
            }
        })
    })
}

exports.processUsage = function (pid) {
    return new Promise(function (resolve, reject) {
        pusage.stat(process.pid, function (err, usage) {
            if (err) {
                reject(err);
            } else {
                usage.memory = usage.memory / (1024 * 1024);
                usage.totalMemory = parseInt(os.totalmem()) / (1024 * 1024);
                usage.cpu = usage.cpu / 100;
                resolve(usage);
            }

        })
    })
}
