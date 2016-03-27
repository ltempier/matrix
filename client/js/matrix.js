'use strict';

var Matrix = function () {
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
    //this.url = "localhost:1989"
    //this.url = "http://195.154.118.152:1989"
};

Matrix.prototype.init = function () {
    window.onresize = this.resizeMatrix.bind(this);
    var self = this;
    var sizeFirebase = new Firebase('https://matrixled.firebaseio.com/size');
    sizeFirebase.on('value', function (snapshot) {
        var size = snapshot.val();
        self.setSize(size.width, size.height);
        for (var x = 0; x < size.width; x++) {
            for (var y = 0; y < size.height; y++) {
                var pixelFirebase = new Firebase('https://matrixled.firebaseio.com/pixels/' + [x, y].join('-'));
                pixelFirebase.on('value', function (snapshot) {
                    var pixel = snapshot.val();
                    self.setPixel(pixel);
                })
            }
        }
    });
};

Matrix.prototype.setSize = function (width, height) {
    this.width = width;
    this.height = height;
    this.createMatrix(true)
};

Matrix.prototype.setPixel = function (pixel) {
    if (!pixel)
        return;
    var rgb = pixel.color;
    $(this.id + ' #' + pixel.x + '-' + pixel.y).css('background-color', 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')');
};

Matrix.prototype.setMatrix = function (pixels) {
    pixels.forEach(this.setPixel)
};

Matrix.prototype.createMatrix = function (clear) {
    if (clear == true)
        $(this.id).empty();


    for (var y = 0; y < this.height; y++) {
        var $row = $('<div></div>');
        $row.addClass('row');
        $row.attr('id', "row-" + y);
        for (var x = 0; x < this.width; x++) {
            var $pixel = $('<div></di>');
            $pixel.addClass('pixel');
            $pixel.attr('id', [(this.width - 1) - x, y].join("-"));
            $pixel.height(0);
            $pixel.width(0);
            $pixel.hide();
            $row.append($pixel);
        }
        $(this.id).append($row);
    }

    this.resizeMatrix();

    var self = this;
    $(this.container + ' .pixel').on('click', function () {
        self.onPixelClick($(this), $(this).attr('id'))
    });
};

Matrix.prototype.onPixelClick = function ($el, id) {
    var color = this.colors[Math.floor(Math.random() * this.colors.length)];
    var oldColor = $el.css('background-color');
    $.ajax({
        url: this.url || '' + '/api/pixel',
        type: 'POST',
        data: {
            id: id,
            color: color
        },
        error: function () {
            $el.css('background-color', oldColor);
        }
    });
    $el.css('background-color', color);
};

Matrix.prototype.resizeMatrix = function () {
    var pixelWidth = $(this.container).width() / this.width;
    var pixelHeight = $(this.container).height() / this.height;
    $('#matrix .pixel').each(function () {
        $(this).width(pixelWidth);
        $(this).height(pixelHeight);
        $(this).show();
    });
};
