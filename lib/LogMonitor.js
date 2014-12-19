/**
 * Created by Shawn Liu on 2014/12/19.
 */
var fs = require('fs'),
    spawn = require('child_process').spawn;
var logger = require("log4js").getLogger("li/LogMonitor.js");
var Log = module.exports = {
    count: 0,
    prev: ''
};
// Empty line.
var re_blank = /^[\s\r\t]*$/;


/**
 * Tail logs from file stream.
 * @param {String|Object} path
 * @param {String} title
 * @param {Number} lines
 * @returns {*}
 */
Log.monitor = function (path, title, lines, callbackFn) {
    var type = 'def';
    // Make options in the right position.
    if (typeof path == 'object') {
        type = path.type || type;
        path = path.path;
    }
    if (typeof title == 'number') {
        lines = title;
        title = null;
    }


    if (!title) {
        title = 'PM2';
    }

    lines = lines || 20;

    // Check file exist or not.
    if (!fs.existsSync(path)) {
        return logger.error(title, 'Log file "' + path + '" does not exist.');
    }

    // Tail logs.
    var tail = spawn('tail', ['-f', '-n', lines, path], {
        // Kill the spawned process by `tail.kill('SIGTERM')`.
        killSignal: 'SIGTERM',
        stdio: [null, 'pipe', 'pipe']
    });

    // Use utf8 encoding.
    tail.stdio.forEach(function (stdio) {
        stdio.setEncoding('utf8');
    });

    // stdout.
    tail.stdout.on('data', function (data) {
        var array = [];
        data.split(/\n/).forEach(function (line) {
            if (!re_blank.test(line)) {
                array.push({
                    "title": title,
                    "line": _getl(line)
                });
            }
        });
        callbackFn(array);
    });

    // handle error.
    tail.stderr.on('data', function (data) {
        tail.disconnect();
        callbackFn({
            "title": title,
            "line": _getl(data.toString().replace(/\n/, ''))
        });
    });

    return tail;
};

var _getl = function(str){

    var reg = /^[0-9]{0,10}m$/;

    var array = [];
    if(str) {
        var reg = /[[0-9]{1,10}m/g;
        str = str.replace(reg," ");
        var index = str.indexOf(" - ");
        array[0] = str.substring(0,index);
        array[1] = str.substr(index+2);
    }
    return array;
}
