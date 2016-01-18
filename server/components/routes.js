"use strict";

var matrix = require('./matrix');

module.exports = function (app) {

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
