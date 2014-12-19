/**
 * Created by Shawn Liu on 14-12-19.
 */

var express = require("express");
var router = express.Router();
var PM2 = require("../lib/PM2");
var logger = require("log4js").getLogger("routes/pm.js");
var config = require("config");
var Promise = require("bluebird");
var systemOperate = require("../lib/systemOperate");

router.get("/logs/:pmId", function (req, res) {
    var pmId = req.params.pmId;
    if (/^[\d]$/.test(pmId)) {
        pmId = parseInt(pmId);
    }
    PM2.logs(pmId, config.line || 30).then(function (d) {
        if (res) {
            res.json(d);
        }
    });
});

router.get("/process/:pmId", function (req, res) {
    var pmId = req.params.pmId;
    if (/^[\d]$/.test(pmId)) {
        pmId = parseInt(pmId);
    }
    PM2.listProcesses()
        .then(function (list) {
            var p = _.find(list, {"pm_id": pmId});
            if (!p) {
                p = _.find(list, {"name": pmId})
            }
            if (!p) {
                res.json({
                    "error": pmId + " doesn't exist"
                })
            } else {
                res.json(p);
            }
        })
});
router.get("/os", function (req, res) {
    PM2.os()
        .then(function (t) {
            t = JSON.parse(t);
            res.json(t);
        })
});
module.exports = router;
