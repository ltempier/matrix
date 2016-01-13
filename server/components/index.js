"use strict";

const async = require('async');

var mqtt = require('./mqtt'),
    database = require('./database'),
    routes = require('./routes');

module.exports.init = function (app, callback) {
    async.parallel([
        mqtt.init.bind(mqtt),
        database.init.bind(database)
    ], callback);
    routes(app)
};