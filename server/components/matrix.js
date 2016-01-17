"use strict";


const _ = require('lodash'),
    async = require('async'),
    Pixel = require('./pixel').Pixel,
    Color = require('./pixel').Color,
    config = require('./../config/index'),
    database = require('./database');

var mqtt = require('./mqtt');

class Matrix {
    constructor() {
        this.separator = ",";
    }

    init(width, height) {
        this.width = width;
        this.height = height;

        database.set({
            size: {
                width: this.width,
                height: this.height
            }
        });
    }

    to2D(n) {
        var y = Math.floor(n / this.width),
            x = n - (y * this.width);
        if (Matrix.isOdd(y))
            x = this.width - x - 1;
        return [x, y]
    }

    to1D(x, y) {
        var n = this.width * y;
        if (Matrix.isOdd(y))
            n += (this.width - x - 1);
        else
            n += x;
        return n
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
