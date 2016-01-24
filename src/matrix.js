var $ = require('jquery');

class Matrix {
    constructor() {
        this.id = '#matrix';
        this.minSize = 10;
        this.maxSize = 50
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.createMatrix(true)
    }

    setPixel(pixel) {
        if (!pixel)
            return;
        const rgb = pixel.color;
        $(this.id + ' #' + pixel.x + '-' + pixel.y).css('background-color', 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')');
    }

    setMatrix(pixels) {
        pixels.forEach(this.setPixel)
    }

    createMatrix(clear) {
        if (clear == true)
            $(this.id).empty();

        var self = this;
        for (var y = 0; y < this.height; y++) {
            var $tr = $('<tr></tr>');
            $tr.addClass('y-axis');
            $tr.attr('data-y', y);
            for (var x = 0; x < this.width; x++) {
                var $td = $('<td></td>');
                $td.addClass('pixel');
                $td.attr('id', [x, y].join("-"));
                $td.on('click', function () {
                    self.onPixelClick($(this), $(this).attr('id'))
                });
                $tr.append($td);
            }
            $(this.id).append($tr);
        }
        this.resizeMatrix();
    }

    onPixelClick() {
        console.log('onPixelClick not define')
    }

    resizeMatrix() {
        var size = $('.matrix-container').width() / this.width;
        size = size < this.minSize ? this.minSize : size;
        size = size > this.maxSize? this.maxSize: size;

        $('#matrix td').each(function () {
            $(this).width(size);
            $(this).height(size - 4);
        })
    }
}


module.exports = Matrix;
