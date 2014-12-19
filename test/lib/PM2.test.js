/**
 * Created by liujianwei on 2014/12/19.
 */
var pm2 = require("../../lib/PM2");
var logger = require("log4js").getLogger("test/lib/PM2.test.js");
pm2.listProcesses()
    .then(function (info) {
        logger.info(info);
        pm2.monitor(3, function (d) {
            console.log(d);
        });
    })
    .catch(function (err) {
        logger.error(err);
        pm2.disconnect();
    })
