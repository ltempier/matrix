"use strict";

const _ = require('lodash'),
    async = require('async'),
    Pixel = require('./pixel').Pixel,
    Color = require('./pixel').Color,
    config = require('./../config/index');

var mqtt = require('./mqtt'),
    database = require('./database');

class Matrix {
    constructor() {
        this.separator = ",";
        this.width = 0;
        this.height = 0;
    }

    setup() {
        this.setSize(this.width, this.height)
    }

    setSize(width, height) {
        const command = 'command/setSize';

        this.width = width;
        this.height = height;

        const message = [width, height].join(this.separator);
        mqtt.sendMessage(command, message)
    }

    setPixel(pixel, callback) {
        const command = 'command/setPixel';

        var color = new Color(pixel.color);
        var xy = pixel.id.split('-');

        const message = this.getMqttSetPixelMessage(xy[0], xy[1], color);
        mqtt.sendMessage(command, message, callback)
    }

    setMatrix(matrix, callback) {
        const command = 'command/setMatrix';

        const message = this.getMqttSetMatrixMessage(matrix);
        mqtt.sendMessage(command, message, callback)
    }

    to2D(n) {
        n = parseInt(n);
        var y = Math.floor(n / this.width),
            x = n - (y * this.width);
        if (Matrix.isOdd(y))
            x = this.width - x - 1;
        return [x, y]
    }

    to1D(x, y) {
        if (_.isArray(x) && _.isUndefined(y)) {
            y = x[1];
            x = x[0]
        }
        x = parseInt(x);
        y = parseInt(y);
        var n = this.width * y;
        if (Matrix.isOdd(y))
            n += (this.width - x - 1);
        else
            n += x;
        return n
    }

    getMqttSetPixelMessage(x, y, color) {
        const n = this.to1D(x, y);
        return [n].concat(color.toArray()).join(this.separator);
    }

    getMqttSetMatrixMessage(pixelArray) {
        return _.map(pixelArray, (pixel) => {
            return this.getMqttSetPixelMessage(pixel.x, pixel.y, pixel.color)
        }).join(this.separator)
    }

    parseMqttSetPixelMessage(message) {
        message = message.toString();
        var array = message.split(this.separator);
        var xy = this.to2D(array[0]);
        var color = new Color(array.splice(1));
        return new Pixel(xy[0], xy[1], color)
    }

    parseMqttSetMatrixMessage(message) {
        message = message.toString();
        var array = message.split(this.separator);
        var matrix = [];
        for (var n = 0; n < array.length; n += 4) {
            var xy = this.to2D(array[n]);
            var color = new Color(array[n + 1], array[n + 2], array[n + 3]);
            matrix.push(new Pixel(xy[0], xy[1], color))
        }
        return matrix
    }

    parseMqttSetSizeMessage(message) {
        message = message.toString();
        var array = message.split(this.separator);
        var size = {
            width: parseInt(array[0]),
            height: parseInt(array[1])
        };
        return size
    }

    static isEven(n) {
        return n % 2 == 0;
    }

    static isOdd(n) {
        return !Matrix.isEven(n);
    }
}


var matrix = new Matrix();

module.exports = matrix;
