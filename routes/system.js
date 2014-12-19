/**
 * Created by Shawn Liu on 14-12-19.
 */

var express = require("express");
var router = express.Router();
var PM2 = require("../lib/PM2");
var logger = require("log4js").getLogger("routes/system");
var config = require("config");
var Promise = require("bluebird");
var systemOperate = require("../lib/systemOperate");
router.get("/process/:processId",function (req, res) {
    systemOperate.processUsage(req.params.processId)
        .then(function (usage) {
            return systemOperate.killProcess(req.params.processId)
                .then(function () {
                    res.json({
                        "pid": req.params.proceddId,
                        "usage": usage
                    });
                })
        })
        .catch(function (err) {
            logger.error(err);
            res.json({
                "status": false,
                "message": err.message || err
            })
        })

})

module.exports = router;
