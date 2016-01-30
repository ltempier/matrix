"use strict";

const _ = require('lodash'),
    async = require('async'),
    Pixel = require('./pixel').Pixel,
    Color = require('./pixel').Color;

var mqtt = require('./mqtt'),
    database = require('./database');

class Matrix {
    constructor() {
        this.defaultColor = "#FFFFFF";
        this.separator = ",";
        this.width = 0;
        this.height = 0;

        this.orientation = "vertical"; // "horizontal" || "vertical"

        this.setMatrixBuffer = {};

        //this.test()
        //setInterval(this.random.bind(this), 1000)
    }

    test() {
        var n = 0;
        setInterval(() => {
            var xy = this.to2D(n);
            this.setPixel(new Pixel(xy[0], xy[1], new Color("#000000")));
            n++;
            if (n > this.width * this.height)
                n = 0;
            xy = this.to2D(n);
            this.setPixel(new Pixel(xy[0], xy[1], new Color("#ff0000")));
        }, 1000)
    }

    random() {
        const githubColors = ['#EEEEEE', '#D6E685', '#8CC665', '#44A340', '#1E6823'];
        this.setPixel(new Pixel(_.random(this.width),
            _.random(this.height),
            new Color(_.sample(githubColors))
        ))
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;

        const message = [width, height].join(this.separator);
        mqtt.sendMessage('command/setSize', message)
    }

    setPixel(pixel, callback) {
        if (!callback || typeof callback !== 'function')
            callback = function (err) {
                if (err)
                    console.error(err);
            };

        var color = new Color(pixel.color);
        var xy = pixel.id.split('-');

        const message = this.getMqttSetPixelMessage(xy[0], xy[1], color);
        mqtt.sendMessage('command/setPixel', message, callback)
    }

    launchSequence(message, callback) {
        if (!callback || typeof callback !== 'function')
            callback = function (err) {
                if (err)
                    console.error(err);
            };
        mqtt.sendMessage('command/launchSequence', message, callback)
    }

    setMatrix(matrix, callback) {
        if (!callback || typeof callback !== 'function')
            callback = function (err) {
                if (err)
                    console.error(err);
            };

        if (matrix.length > 50) {
            var matrices = [];
            for (var i = 0; i < matrix.length; i += 50)
                matrices.push(matrix.slice(i, i + 50))

            async.eachSeries(matrices, (mx, cb) => {
                this.setMatrix(mx, cb)
            }, callback)

        } else {
            var id = generateId(this);
            var message = this.getMqttSetMatrixMessage(matrix);
            message = id + this.separator + message;
            mqtt.sendMessage('command/setMatrix', message, (err) => {
                if (err)
                    return callback(err);
                this.setMatrixBuffer[id] = matrix;
                setTimeout(() => {
                    this.setMatrixBuffer[id] = null;
                }, 10000);
                callback()
            });
        }

        function generateId(self) {
            var id = 0;
            while (self.setMatrixBuffer[id])
                id++;
            return id
        }
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

        x = this.width - x;

        return [x, y]
    }

    to1D(x, y) {
        if (_.isArray(x) && _.isUndefined(y)) {
            y = x[1];
            x = x[0]
        }
        x = parseInt(x);

        x = this.width - x;

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
        //this.setMatrix(dbMatrix);
        database.setMatrix(dbMatrix);
    }

    onSetMatrixCallback(message) {
        message = message.toString();
        /*var array = message.split(this.separator);
         var matrix = [];
         for (var n = 0; n < array.length; n += 4) {
         var xy = this.to2D(array[n]);
         var color = new Color(array[n + 1], array[n + 2], array[n + 3]);
         matrix.push(new Pixel(xy[0], xy[1], color))
         }*/
        var matrix = this.setMatrixBuffer[message];
        if (matrix)
            database.setMatrix(matrix)
    }

    onSetSizeCallback(message) {
        message = message.toString();
        var array = message.split(this.separator);
        this.width = parseInt(array[0]);
        this.height = parseInt(array[1]);
        database.setSize({
            width: this.width,
            height: this.height
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
