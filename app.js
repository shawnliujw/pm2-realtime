/**
 * Created by Shawn Liu on 2014/12/19.
 */
var express = require('express');
var config = require("config");
var app = express();
var logger = require("log4js").getLogger("app.js");
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

var io = require('socket.io')(server);
io.on('connection', function (socket) {
    socket.on('monitor', function (msg) {
        logger.info("socket receive 'monitor':", msg);
        socket.emit("monitor", msg);
    });
    socket.on('disconnect', function () {
        logger.info("socket disconnect");
    });
});
// Start server
server.listen(config.port, function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

var pm2 = require("./lib/PM2");
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

// Expose app
exports = module.exports = app;
