"use strict";

const _ = require('lodash');

class Pixel {
    constructor(x, y, color) {

        this.x = x;
        this.y = y;

        this.id = [x, y].join('-');

        this.color = new Color(color)
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y,
            color: this.color.toJSON()
        }
    }

    setColor(color) {
        this.color.set(color)
    }

    getColorArray() {
        return this.color.toArray()
    }
}

class Color {
    constructor(r, g, b) {
        this.colorProperties = ['r', 'g', 'b'];

        this.r = 0;
        this.g = 0;
        this.b = 0;

        this.set.apply(this, arguments)
    }

    set() {
        var color = {};
        if (arguments.length == 1) {
            if (_.isArray(arguments[0])) {
                arguments[0].forEach((value, index) => {
                    var key = this.colorProperties[index];
                    if (key)
                        color[key] = value
                })
            }
            else if (_.isString(arguments[0])) {
                while (arguments[0].charAt(0) === '#')
                    arguments[0] = arguments[0].substr(1);
                var num = parseInt(arguments[0], 16);
                var rgb = [num >> 16, num >> 8 & 255, num & 255];
                this.r = rgb[0];
                this.g = rgb[1];
                this.b = rgb[2];
            }
            else if (_.isObject(arguments[0])) {
                color = arguments[0]
            }
        } else if (arguments.length <= this.colorProperties.length) {
            for (var i = 0; i < arguments.length; i++) {
                var key = this.colorProperties[i];
                if (key)
                    color[key] = arguments[i]
            }
        } else
            return;

        this.colorProperties.forEach((key) => {
            var value = color[key];
            if (isNaN(value))
                return;

            value = parseInt(value);
            if (_.inRange(value, -1, 256))
                this[key] = value
        })
    }

    toJSON() {
        return _.pick(this, this.colorProperties)
    }

    toArray() {
        return this.colorProperties.map((key) => {
            return this[key]
        })
    }
}

module.exports.Pixel = Pixel;
module.exports.Color = Color;
