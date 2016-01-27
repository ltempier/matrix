"use strict";

var _ = require('lodash'),
    matrix = require('./matrix'),
    Pixel = require('./pixel').Pixel,
    Color = require('./pixel').Color,
    config = require('../config');

module.exports = function (app) {


    app.route('/setmatrix')
        .get(function (req, res) {
            var dbMatrix = [];

            var color1 = "#DE4508";
            var color2 = "#5ac8fa";

            for (var x = 0; x < matrix.width; x++) {
                for (var y = 0; y < matrix.height; y++) {
                    dbMatrix.push(new Pixel(x, y, new Color(_.sample([color1, color2]))))
                }
            }
            matrix.setMatrix(dbMatrix);
            res.sendStatus(200)
        });

    app.route('/api/firebase/url')
        .get(function (req, res) {
            res.status(200).send(config.firebase.url)
        });

    app.route('/api/pixel')
        .put(function (req, res) {
            matrix.setPixel(req.body, function (err) {
                if (err)
                    res.sendStatus(500);
                else
                    res.sendStatus(200)
            })
        });
};
