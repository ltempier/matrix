"use strict";


const async = require('async'),
    Pixel = require('./pixel');

var mqtt = require('./mqtt'),
    database = require('./database');

class Matrix {
    constructor(width, height) {
        this.width = width;
        this.height = height;

    }
}


var matrix = new Matrix(10, 10);
module.exports = matrix;