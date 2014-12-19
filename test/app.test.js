/**
 * Created by liujianwei on 2014/12/19.
 */
var expect = require('chai').expect,
    mocha = require('mocha');

var io = require('socket.io-client');

describe("test socket server", function () {

    var server,
        options = {
            transports: ['websocket'],
            'force new connection': true
        };

    beforeEach(function (done) {
        // start the server
        server = require('../app').server;

        done();
    });
    it("echos message", function (done) {
        var client = io.connect("http://localhost:9991", options);
        client.once("connect", function () {
            client.once("monitor", function (message) {
                expect(message).to.be.equal("Hello World");
                client.disconnect();
                done();
            });
            client.emit("monitor", "Hello World");
        });
    });
})
