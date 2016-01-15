//style
require("bootstrap-webpack");
require('simple-color-picker/simple-color-picker.css');
require('./style.css');

var $ = require('jquery');
var ColorPicker = require('simple-color-picker');
var Matrix = require('./matrix');

Matrix.prototype.onPixelClick = function ($el, xy) {
    const rgb = colorPicker.getRGB();
    console.log(xy, rgb);
    $el.css('background-color', 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')');
};

var colorPicker = new ColorPicker({
    color: '#FF0000',
    background: '#454545',
    el: document.getElementById("color-picker")
});

$(document).ready(function () {
    $.get('/api/matrix', function (res) {
        var matrix = new Matrix(res.width, res.height);
        matrix.setMatrix(res.pixels)
    });
});

