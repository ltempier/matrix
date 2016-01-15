var $ = require('jquery');

class Matrix {
    constructor(width, height, pixels) {
        this.id = '#matrix';
        this.width = width;
        this.height = height;
        this.createMatrix();
        window.onresize = this.resizeMatrix.bind(this);

        if (pixels)
            this.setMatrix(pixels)
    }

    setMatrix(pixels) {
        pixels.forEach((pixel) => {
            const rgb = pixel.color;
            $(this.id + ' #' + pixel.x + '-' + pixel.y).css('background-color', 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')');
        })
    }

    createMatrix() {
        var self = this;
        for (var y = 0; y < this.height; y++) {
            var $tr = $('<tr></tr>');
            $tr.addClass('y-axis ' + y);
            $tr.attr('data-y', y);
            for (var x = 0; x < this.width; x++) {
                var $td = $('<td></td>');
                $td.addClass('pixel x-axis ' + x);
                $td.attr('id', x + "-" + y);
                $td.on('click', function () {
                    var xy = $(this).attr('id').split('-').map(v => parseInt(v));
                    self.onPixelClick($(this), xy)
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
        const minSize = 10;
        var size = $('.matrix-container').width() / this.width;
        size = size < minSize ? minSize : size;
        $('#matrix td').each(function () {
            $(this).width(size);
            $(this).height(size - 2);
        })
    }
}


module.exports = Matrix;
