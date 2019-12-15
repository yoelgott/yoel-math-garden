const BACKGROUND_COLOUR = '#000000';
const LINE_COLOUR = '#FFFFFF';
const LINE_WIDTH = 10;

let currentX = 0;
let currentY = 0;
let previousX = 0;
let previousY = 0;

let isDrawing = false;

var canvas;
var context;

function prepareCanvas() {
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');

    context.fillStyle = BACKGROUND_COLOUR;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    context.strokeStyle = LINE_COLOUR;
    context.lineWidth = LINE_WIDTH
    context.lineJoin = 'round';

    document.addEventListener('mousedown', function (event) {
        isDrawing = true;
    });

    document.addEventListener('mousemove', function (event) {
        previousX = currentX;
        previousY = currentY;

        currentX = event.clientX - canvas.offsetLeft;
        currentY = event.clientY - canvas.offsetTop;

        if (event.clientX < canvas.offsetLeft || event.clientX > canvas.offsetLeft + canvas.offsetWidth ||
            event.clientY < canvas.offsetTop || event.clientY > canvas.offsetTop + canvas.offsetHeight) {
                isDrawing = false;
            };

        if (isDrawing) {
            draw();
        };
    });

    document.addEventListener('mouseup', function (event) {
        isDrawing = false;
    });

    // Touch Events
    canvas.addEventListener('touchstart', function (event) {
        isDrawing = true;
        
        currentX = event.touches[0].clientX - canvas.offsetLeft;
        currentY = event.touches[0].clientY - canvas.offsetTop;

        console.log('Touch Down!');
        
    });

    canvas.addEventListener('touchmove', function (event) {
        previousX = currentX;
        previousY = currentY;

        currentX = event.touches[0].clientX - canvas.offsetLeft;
        currentY = event.touches[0].clientY - canvas.offsetTop;

        if (event.clientX < canvas.offsetLeft || event.clientX > canvas.offsetLeft + canvas.offsetWidth ||
            event.clientY < canvas.offsetTop || event.clientY > canvas.offsetTop + canvas.offsetHeight) {
                isDrawing = false;
            };

        if (isDrawing) {
            draw();
        };
    });

    canvas.addEventListener('touchend', function (event) {
        isDrawing = false;
    });

    canvas.addEventListener('touchcancel', function (event) {
        isDrawing = false;
    });
};

function draw() {
    context.beginPath();
    context.moveTo(previousX, previousY);
    context.lineTo(currentX, currentY);
    context.stroke();
}

function clearCanvas() {
    let currentX = 0;
    let currentY = 0;
    let previousX = 0;
    let previousY = 0;

    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    
}