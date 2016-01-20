//style
require("bootstrap-webpack");
require('simple-color-picker/simple-color-picker.css');
require('./style.css');

var $ = require('jquery');
var ColorPicker = require('simple-color-picker');
var Matrix = require('./matrix');
var Firebase = require('firebase');

var sizeFirebase = new Firebase('https://matrixled.firebaseio.com/size');

Matrix.prototype.onPixelClick = function ($el, id) {
    const rgb = colorPicker.getRGB();
    $.ajax({
        url: '/api/pixel',
        type: 'PUT',
        data: {
            id: id,
            color: rgb
        },
        success: function () {
            $el.css('background-color', 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')');
        }
    })

};

var colorPicker = new ColorPicker({
    color: '#FF0000',
    background: '#454545',
    el: document.getElementById("color-picker")
});

$(document).ready(function () {

    var matrix = new Matrix();
    window.onresize = matrix.resizeMatrix.bind(matrix);

    sizeFirebase.on('value', function (snapshot) {
        const size = snapshot.val();
        matrix.setSize(size.width, size.height);

        for (var x = 0; x < size.width; x++) {
            for (var y = 0; y < size.height; y++) {
                const pixelFirebase = new Firebase('https://matrixled.firebaseio.com/pixels/' + [x, y].join('-'));
                pixelFirebase.on('value', function (snapshot) {
                    const pixel = snapshot.val();
                    matrix.setPixel(pixel)


                    console.log('last date: ', Date())
                })
            }
        }
    })
});

