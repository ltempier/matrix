'use strict';

var Matrix = function (option) {
    this.id = '#matrix';
    this.container = ".matrix-container";
    this.colors = [
        "#113F8C",
        "#01A4A4",
        "#00A1CB",
        "#61AE24",
        "#D0D102",
        "#32742C",
        "#D70060",
        "#E54028",
        "#F18D05",
        "#F18D05"
    ];

    this.option = option;

    window.onresize = this.resizeMatrix.bind(this);

    this.createMatrix(option.width, option.height);
    this.renderMatrix(true);

    var size = this.getMatrixSize(this.matrix);
    var self = this;
    for (var x = 0; x < size.width; x++) {
        for (var y = 0; y < size.height; y++) {
            var pixelFirebase = new Firebase('https://matrixled.firebaseio.com/pixels/' + [x, y].join('-'));
            pixelFirebase.on('value', function (snapshot) {
                var pixel = snapshot.val();
                self.setPixel(pixel);
            })
        }
    }
};

Matrix.prototype.createMatrix = function (width, height) {
    var self = this;
    var matrix = [], row = [];
    var x, y, n = 0;
    for (y = 0; y < height; y++) {
        matrix[y] = row = [];
        if (y % 2)
            for (x = width - 1; x >= 0; x--)
                row[x] = n++
        else
            for (x = 0; x < width; x++)
                row[x] = n++
    }

    matrix = rotate(matrix);
    this.matrix = matrix;

    function revert(matrix) {
        var size = self.getMatrixSize(matrix);
        var buffer = self.createMatrixArray(size.height, size.width), x, y;
        for (x = 0; x < size.width; x++) {
            for (y = 0; y < size.height; y++) {
                buffer[x][y] = matrix[y][x]
            }
        }
        return buffer
    }

    function rotate(matrix) {
        var size = self.getMatrixSize(matrix);
        var buffer = self.createMatrixArray(size.height, size.width), x, y;
        for (y = 0; y < size.height; y++) {
            for (x = 0; x < size.width; x++) {
                var by = x;
                var bx = (size.height - 1) - y;
                buffer[by][bx] = matrix[y][x]
            }
        }
        return buffer
    }
};

Matrix.prototype.setPixel = function (pixel) {
    if (!pixel)
        return;
    var rgb = pixel.color;
    $(this.id + ' #' + pixel.x + '-' + pixel.y).css('background-color', 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')');
};

Matrix.prototype.getMatrixSize = function (matrix) {
    var height = matrix.length || 0, width = 0;
    if (height)
        width = matrix[0].length || 0;
    return {
        width: width,
        height: height
    }
};

Matrix.prototype.createMatrixArray = function (width, height) {
    var matrix = [], row = [];
    for (var x = 0; x < width; x++)
        row.push(null);
    for (var y = 0; y < height; y++)
        matrix.push(row.slice())
    return matrix
};

Matrix.prototype.renderMatrix = function (clear) {
    if (clear == true)
        $(this.id).empty();

    var size = this.getMatrixSize(this.matrix);
    for (var y = 0; y < size.height; y++) {
        var $row = $('<div></div>');
        $row.addClass('row');
        $row.attr('id', "row-" + y);

        var row = this.matrix[y];
        for (var x = 0; x < row.length; x++) {
            var n = row[x];

            var $cell = $('<div></di>');
            $cell.addClass('cell pixel');
            $cell.attr('id', [x, y].join("-"));
            $cell.attr('n', n);
            //$cell.text(n);
            $cell.hide();

            $row.append($cell);
        }
        $(this.id).append($row);
    }

    this.resizeMatrix();

    var self = this;
    $(this.container + ' .pixel').on('click', function () {
        self.onPixelClick($(this), $(this).attr('id'), $(this).attr('n'))
    });
};

Matrix.prototype.onPixelClick = function ($el, id, n) {
    var color = this.colors[Math.floor(Math.random() * this.colors.length)];
    var oldColor = $el.css('background-color');
    $.ajax({
        url: (this.option.url || '') + '/api/led',
        type: 'POST',
        data: {
            n: n,
            color: color
        },
        error: function () {
            $el.css('background-color', oldColor);
        }
    });
    $el.css('background-color', color);
};

Matrix.prototype.resizeMatrix = function () {
    var size = this.getMatrixSize(this.matrix);
    var pixelWidth = $(this.container).width() / size.width;
    var pixelHeight = $(this.container).height() / size.height;
    $('#matrix .pixel').each(function () {
        $(this).width(pixelWidth);
        $(this).height(pixelHeight);
        $(this).show();
    });
};


$(document).ready(function () {
    new Matrix({
        width: 27,
        height: 12,
        url: "http://195.154.118.152:1989"
    });
});
