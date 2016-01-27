"use strict";

const _ = require('lodash'),
    async = require('async'),
    Pixel = require('./pixel').Pixel,
    Color = require('./pixel').Color;

var mqtt = require('./mqtt'),
    database = require('./database');

class Matrix {
    constructor() {
        this.defaultColor = "#000000";
        this.separator = ",";
        this.width = 0;
        this.height = 0;

        this.orientation = "vertical"; // "horizontal" || "vertical"

        //setInterval(this.random.bind(this), 1000)
    }

    random() {
        const githubColors = ['#EEEEEE', '#D6E685', '#8CC665', '#44A340', '#1E6823'];
        this.setPixel(new Pixel(_.random(this.width),
            _.random(this.height),
            new Color(_.sample(githubColors))
        ))
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
        var x, y;
        if (this.orientation == "horizontal") {
            y = Math.floor(n / this.width);
            x = n - (y * this.width);
            if (Matrix.isOdd(y))
                x = this.width - x - 1;
        } else if (this.orientation == "vertical") {
            x = Math.floor(n / this.height);
            y = n - (x * this.height);
            if (Matrix.isOdd(x))
                y = this.height - y - 1;
        }
        return [x, y]
    }

    to1D(x, y) {
        if (_.isArray(x) && _.isUndefined(y)) {
            y = x[1];
            x = x[0]
        }
        x = parseInt(x);
        y = parseInt(y);
        var n;
        if (this.orientation == "horizontal") {
            n = this.width * y;
            if (Matrix.isOdd(y))
                n += (this.width - x - 1);
            else
                n += x;
        } else if (this.orientation == "vertical") {
            n = this.height * x;
            if (Matrix.isOdd(x))
                n += (this.height - y - 1);
            else
                n += y;
        }
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

    onSetPixelCallback(message) {
        message = message.toString();
        var array = message.split(this.separator);
        var xy = this.to2D(array[0]);
        var pixel = new Pixel(xy[0], xy[1], new Color(array.splice(1)));
        database.setPixel(pixel)
    }

    onSetupCallback() {
        this.setSize(this.width, this.height);
        var dbMatrix = [];
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                dbMatrix.push(new Pixel(x, y, new Color(this.defaultColor)))
            }
        }
        this.setMatrix(dbMatrix);
    }

    onSetMatrixCallback(message) {
        message = message.toString();
        var array = message.split(this.separator);
        var matrix = [];
        for (var n = 0; n < array.length; n += 4) {
            var xy = this.to2D(array[n]);
            var color = new Color(array[n + 1], array[n + 2], array[n + 3]);
            matrix.push(new Pixel(xy[0], xy[1], color))
        }
        database.setMatrix(matrix)
    }

    onSetSizeCallback(message) {
        message = message.toString();
        var array = message.split(this.separator);
        this.width = parseInt(array[0]);
        this.height = parseInt(array[1]);
        database.setSize({
            width:this.width,
            height:this.height
        })
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
