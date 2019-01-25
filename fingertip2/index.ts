import {Webcam} from '../webcam/webcam';

require('tracking');

declare var tracking;
const {pow, sqrt} = Math;

const videoElement: HTMLVideoElement = document.querySelector('#video');
const canvasElement: HTMLCanvasElement = document.querySelector('#canvas');
const context: CanvasRenderingContext2D = canvasElement.getContext('2d');
const slider: HTMLInputElement = document.querySelector('#slider');
let webcam: Webcam;
let color = {r: 199, g: 206, b: 91};

tracking.ColorTracker.registerColor('pointer', (r, g, b) => {
    return getColorDistance(color, {r: r, g: g, b: b}) < parseInt(slider.value)
});

const tracker = new tracking.ColorTracker('pointer');

// Add callback for the "track" event
tracker.on('track', e => results = e.data);

canvasElement.addEventListener('click', (e) => {
    const ratioX = e.offsetX * canvasElement.width / canvasElement.offsetWidth;
    const ratioY = e.offsetY * canvasElement.height / canvasElement.offsetHeight;
    const pixel = context.getImageData(ratioX, ratioY, 1, 1).data;
    const pixColor = {r: pixel[0], g: pixel[1], b: pixel[2]};
    console.log(pixColor);
    color = pixColor;
});

let results = [];

async function init() {
    webcam = await Webcam.of(videoElement);
    // Register our custom color tracking function
    tracking.track(videoElement, tracker, {camera: true});
    const tickFn = () => {
        tick();
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
        draw();
        for (let rect of results) {
            context.strokeStyle = `rgb(41, 144, 209)`;
            context.lineWidth = 1;
            //context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            const xCenter = rect.x + rect.width / 2;
            const yCenter = rect.y + rect.height / 2;
            drawCircle(context, xCenter, yCenter, 20);
        }
        if (results.length === 3) {
            context.lineWidth = 3;
            //https://math.stackexchange.com/a/1268279
            const [x1, x2, x3] = [0, 1, 2].map(i => results[i].x + results[i].width / 2);
            const [y1, y2, y3] = [0, 1, 2].map(i => results[i].y + results[i].height / 2);

            const mr = (y2 - y1) / (x2 - x1);
            const mt = (y3 - y2) / (x3 - x2);

            const x = (mr * mt * (y3 - y1) + mr * (x2 + x3) - mt * (x1 + x2)) / (2 * (mr - mt));
            const y = (y1 + y2) / 2 - (x - (x1 + x2) / 2) / mr;

            //sqrt((x2 - x)² + (y2 - y)²)
            const radius = sqrt(pow(x2 - x, 2) + pow(y2 - y, 2));
            drawCircle(context, x, y, radius - 20);
            drawCircle(context, x, y, radius + 20);
        }
        requestAnimationFrame(tickFn);
    };
    tickFn();
}

function tick() {
}

function draw() {
    webcam.shotToCanvas(canvasElement);
}

function drawCircle(context: CanvasRenderingContext2D, x: number, y: number, radius: number) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.stroke();
}

// Calculates the Euclidian distance between the target color and the actual color
const getColorDistance = (target, actual) => sqrt(
    pow(target.r - actual.r, 2) + pow(target.g - actual.g, 2) + pow(target.b - actual.b, 2)
);

init();