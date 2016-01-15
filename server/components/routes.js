"use strict";

var matrix = require('./matrix');

module.exports = function (app) {

    app.route('/api/pixel')
        .get(function (req, res) {
            res.status(200).send('get pixel');
        });

    app.route('/api/matrix')
        .get(function (req, res) {
            res.status(200).send('get matrix');
        });
};
