"use strict";


const _ = require('lodash'),
    async = require('async'),
    Pixel = require('./pixel').Pixel,
    Color = require('./pixel').Color;

var mqtt = require('./mqtt');

class Matrix {
    constructor(width, height) {
        this.separator = ",";
        this.width = width;
        this.height = height;
        this.pixels = _.map(new Array(height), function (array, y) {
            return _.map(new Array(width), function (array, x) {
                return new Pixel(x, y);
            })
        });


        this.setPixelColor(0, 0, new Color(200, 200, 200))
    }

    setPixelColor(x, y, color) {
        if (x >= this.width || y >= this.height)
            return;

        const mqttMessage = this.getMqttPixel(x, y, color);
        mqtt.sendMessage("command/setPixel", mqttMessage, (err) => {
            this.pixels[y][x].setColor(color);
        })
    }

    getMqttPixel(x, y, color) {
        var n = this.width * y;
        if (Matrix.isOdd(y))
            n += (this.width - x - 1);
        else
            n += x;
        return [n].concat(color.toArray()).join(this.separator)
    }

    getMqttMatrix() {
        var bufferArray = [];
        this.pixels.forEach((line, indexLine) => {
            if (Matrix.isOdd(indexLine))
                line = line.reverse();
            line.forEach((pixel) => {
                bufferArray.push(pixel.getColorArray().join(this.separator))
            })
        });
        return bufferArray.join(this.separator)
    }

    static isEven(n) {
        return n % 2 == 0;
    }

    static isOdd(n) {
        return !Matrix.isEven(n);
    }
}


var matrix = new Matrix(10, 5);
module.exports = matrix;
