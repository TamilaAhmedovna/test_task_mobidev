import Buffer from './Buffer';

window.onload = function () {
    var canvasElement = document.getElementById('myCanvas');

    var widthElement = document.getElementById('lineWidth');
    var colorElement = document.getElementById('lineColor');
    var clearElement = document.getElementById('clear');

    var undoElement = document.getElementById('undo');
    var redoElement = document.getElementById('redo');
    var saveElement = document.getElementById('save');
    var loadElement = document.getElementById('load');
    var plusElement = document.getElementById('plus');
    var minusElement = document.getElementById('minus');
    var filterElement = document.getElementById('filter');

    var context = canvasElement.getContext('2d');
    var rect = canvasElement.getBoundingClientRect();
    var buffer = new Buffer(canvasElement.toDataURL());

    var widthCanvas = canvasElement.width;
    var heightCanvas = canvasElement.height;
    var scale = 1;
    var scaleObj = {
        x: 0,
        y: 0,
        width: widthCanvas,
        height: heightCanvas,
    };

    const SCALE_MAX = 2;
    const SCALE_MIN = 0.1;

    canvasElement.addEventListener('mousedown', mouse_down);
    canvasElement.addEventListener('contextmenu', stopMouseDefault);

    widthElement.addEventListener('change', change_width);
    colorElement.addEventListener('change', change_color);
    clearElement.addEventListener('click', clearCanvas);

    undoElement.addEventListener('click', undoCanvas);
    redoElement.addEventListener('click', redoCanvas);
    saveElement.addEventListener('click', saveCanvas);
    loadElement.addEventListener('click', loadCanvas);
    plusElement.addEventListener('click', plusCanvas);
    minusElement.addEventListener('click', minusCanvas);
    filterElement.addEventListener('change', filterCanvas);

    change_width();
    change_color();
    filterCanvas();

    function mouse_down() {
        context.beginPath();
        canvasElement.addEventListener('mousemove', mouse_move);
        document.addEventListener('mouseup', mouse_up);
    }

    function stopMouseDefault(e) {
        e.preventDefault();
    }

    function mouse_move(e) {
        renderLine(e);
    }

    function mouse_up() {
        canvasElement.removeEventListener('mousemove', mouse_move);
        document.removeEventListener('mouseup', mouse_up);
        buffer.add(canvasElement.toDataURL());
    }

    function renderLine(e) {
        let canvas_x = e.pageX - rect.left;
        let canvas_y = e.pageY - rect.top;

        ((x, y) => {
            setTimeout(function () {
                context.lineTo(x, y);
                context.moveTo(x, y);
                context.stroke();
            }, 1)
        })(canvas_x, canvas_y);
    }

    function change_width() {
        let color_value = widthElement.options[widthElement.selectedIndex].value;
        context.lineWidth = color_value;
    }

    function change_color() {
        let color_value = colorElement.value;
        context.strokeStyle = color_value;
    }

    function clearCanvas(e) {
        context.clearRect(0, 0, widthCanvas, heightCanvas);
        buffer.clear();
    }

    function undoCanvas() {
        context.clearRect(0, 0, widthCanvas, heightCanvas);
        render(buffer.undo());
    }

    function redoCanvas() {
        context.clearRect(0, 0, widthCanvas, heightCanvas);
        render(buffer.redo());
    }

    function saveCanvas() {
        buffer.save();
        localStorage.setItem("imgCanvas", JSON.stringify(buffer.items));
    }

    function loadCanvas() {
        let dataUrlArr = JSON.parse(localStorage.getItem('imgCanvas'));
        if ( !dataUrlArr || dataUrlArr.length === 0 ) return;

        context.clearRect(0, 0, widthCanvas, heightCanvas);
        buffer.load(dataUrlArr);
        render(buffer.currentElem());
    }

    function plusCanvas() {
        context.clearRect(0, 0, widthCanvas, heightCanvas);
        scale += 0.1;
        if (scale > SCALE_MAX) scale = SCALE_MAX;

        scaleObj.width = widthCanvas * scale;
        scaleObj.height = heightCanvas * scale;
        scaleObj.x = -(scaleObj.width - widthCanvas)/2;
        scaleObj.y = -(scaleObj.height - heightCanvas)/2;

        render(buffer.currentElem());
    }

    function minusCanvas() {
        context.clearRect(0, 0, widthCanvas, heightCanvas);
        scale -= 0.1;
        if (scale < SCALE_MIN) scale = SCALE_MIN;

        scaleObj.width = widthCanvas * scale;
        scaleObj.height = heightCanvas * scale;
        scaleObj.x = -(scaleObj.width - widthCanvas)/2;
        scaleObj.y = -(scaleObj.height - heightCanvas)/2;

        render(buffer.currentElem());
    }

    function filterCanvas() {
        context.clearRect(0, 0, widthCanvas, heightCanvas);

        switch (filterElement.value) {
            case 'Размытие': {
                context.filter = 'blur(2px)';
                break;
            }
            case 'Яркость': {
                context.filter = 'brightness(50%)';
                break;
            }
            case 'Контраст': {
                context.filter = 'contrast(50%)';
                break;
            }
            case 'Тени': {
                context.filter = 'drop-shadow(5px 5px 3px black)';
                break;
            }
            case 'Черно-белый': {
                context.filter = 'grayscale(100%)';
                break;
            }
            case 'Инвертировать': {
                context.filter = 'invert(100%)';
                break;
            }
            default: {
                context.filter = 'none';
            }
        }

        render(buffer.currentElem());
    }

    function render(image) {
        let img = new Image();

        img.onload = function() {
            context.drawImage(img, scaleObj.x, scaleObj.y, scaleObj.width, scaleObj.height);
        };

        img.src = image;
    }

};
