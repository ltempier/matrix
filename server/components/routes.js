"use strict";

var _ = require('lodash'),
    matrix = require('./matrix'),
    Pixel = require('./pixel').Pixel,
    Color = require('./pixel').Color,
    config = require('../config');

module.exports = function (app) {


    app.route('/test')
        .get(function (req, res) {
            var dbMatrix = [];
            for (var x = 0; x < matrix.width; x++) {
                for (var y = 0; y < matrix.height; y++) {
                    dbMatrix.push(new Pixel(x, y, new Color(255, 255, 255)))
                }
            }
            matrix.setMatrix(dbMatrix, function (err) {
                if (err)
                    res.sendStatus(500);
                else
                    res.sendStatus(200)
            })
        });

    app.route('/api/firebase/url')
        .get(function (req, res) {
            res.status(200).send(config.firebase.url)
          });

    app.route('/api/sequence')
        .put(function (req, res) {
            matrix.launchSequence(req.body["sequence"], function (err) {
                if (err){
                    res.sendStatus(500);
                }
                else
                    res.sendStatus(200)
            })
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

    app.route('/api/matrix')
        .put(function (req, res) {
            matrix.setMatrix(req.body, function (err) {
                if (err)
                    res.sendStatus(500);
                else
                    res.sendStatus(200)
            })
        });
};
