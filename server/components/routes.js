"use strict";

var matrix = require('./matrix');

module.exports = function (app) {

    app.route('/')
        .get(function (req, res) {
            res.status(200).send('ok google');
        });

    app.use('/*', function (req, res) {
        res.status(404).send('Not found');
    });
};
