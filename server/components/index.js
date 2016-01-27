"use strict";

const async = require('async');

var mqtt = require('./mqtt'),
    database = require('./database');

module.exports.init = function (app, callback) {
    async.parallel([
        mqtt.init.bind(mqtt),
        database.init.bind(database)
    ], function (err) {
        if (err)
            return callback(err);

        require('./matrix').setSize(20, 1);
        require('./routes')(app);
        callback()
    })
};
