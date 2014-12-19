/**
 * Created by liujianwei on 2014/12/19.
 */
/**
 * Express configuration
 */

'use strict';
var express = require('express');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('config');
module.exports = function (app) {
    //app.set('views', path.join(__dirname, '../views'));
    //app.engine('html', require('ejs').renderFile);
    //app.set('view engine', 'html');
    app.use(compression());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(morgan('dev'));
    if (process.env.NODE_ENV === 'development') {
        app.use(errorHandler()); // Error handler - has to be last
        // only use in development
    }
};
