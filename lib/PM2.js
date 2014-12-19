/**
 * Created by Shawn Liu on 2014/12/19.
 */

var Promise = require("bluebird");
var pm2Instance = require("pm2");
var logger = require("log4js").getLogger("lib/PM2.js");
var _ = require("lodash");
var config = require("config");
var connected = false;
var PM2 = {};
var rp = require("request-promise");
var LogMonitor = require("./LogMonitor");
var async = require("async");
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
PM2.enableWeb = function(){
    return PM2.connect()
        .then(pm2Instance.web);
};
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
            return pm2Instance.list();
        })
}

//processName  name or id
PM2.logs = function (id, lines) {
    var logsArray = [];
    var done = false;
    return new Promise(function (resolve, reject) {
        async.until(function until() {
            return done;
        }, function (callback) {
            if (done) {
                callback();
            } else {
                _monitor(id, lines, function (d) {
                    if (logsArray.length === lines) {
                        logsArray.shift();
                    }
                    Array.prototype.push.apply(logsArray, d);
                    done = true;
                    callback();
                });
            }


        }, function callback() {
            done = false;
            resolve(_.cloneDeep(logsArray).reverse());
        });
    });

}

PM2.os = function () {
    var options = {
        uri : "http://localhost:" + config.pmHttpInterfacePort,
        method : 'GET',
        "headers":{
            "content-type":"application/json"
        }
    };
    return rp(options);
}

var _monitor = function (id, lines, fn) {
    return PM2.listProcesses()
        .then(function (list) {
            list.forEach(function (proc) {
                if ((!id || (id && !isNaN(parseInt(id)) && proc.pm_id == id)) ||
                    (!id || (id && isNaN(parseInt(id)) && proc.pm2_env.name == id))) {
                    var app_name = (proc.pm2_env.name || p.basename(proc.pm2_env.pm_exec_path)) + '-' + proc.pm_id;

                    ['', 'out', 'err'].some(function (n) {
                        var pk = 'pm_' + (n ? n + '_' : '') + 'log_path';
                        if (pk in proc.pm2_env) {
                            LogMonitor.monitor({
                                path: proc.pm2_env[pk],
                                type: !n ? 'entire' : n
                            }, app_name, lines, fn);
                            // return !n;
                        }
                        // return false;
                    });
                }
            });
        })
}

var _processUsage = function (pid) {
    return new Promise(function (resolve, reject) {
        pusage.stat(process.pid, function (err, usage) {
            usage.memory = usage.memory / (1024 * 1024);
            usage.totalMemory = parseInt(os.totalmem()) / (1024 * 1024);
            usage.cpu = usage.cpu / 100;
            resolve(usage);
        })
    })
}

_convertToPromise();
module.exports = PM2;
