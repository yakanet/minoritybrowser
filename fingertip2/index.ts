import {Webcam} from '../webcam/webcam';
import {ColorTracker} from './src/color-tracker';
import {CircleMenuSprite} from './src/circle-menu.sprite';
import {drawText} from './src/draw-util';

const {ceil} = Math;

const videoElement: HTMLVideoElement = document.querySelector('#video');
const canvasElement: HTMLCanvasElement = document.querySelector('#canvas');
const context: CanvasRenderingContext2D = canvasElement.getContext('2d');
const slider: HTMLInputElement = document.querySelector('#slider');
let webcam: Webcam;

const colorTracker = new ColorTracker();
const circleMenu = new CircleMenuSprite();

canvasElement.addEventListener('click', (e) => {
    const ratioX = e.offsetX * canvasElement.width / canvasElement.offsetWidth;
    const ratioY = e.offsetY * canvasElement.height / canvasElement.offsetHeight;
    const pixel = context.getImageData(ratioX, ratioY, 1, 1).data;
    console.log({r: pixel[0], g: pixel[1], b: pixel[2]});
    colorTracker.color = {r: pixel[0], g: pixel[1], b: pixel[2]};
});

async function init() {
    webcam = await Webcam.of(videoElement);
    colorTracker.start(videoElement);

    let lastCalledTime = performance.now();
    let fps = 0;

    const tickFn = () => {
        const delta = (performance.now() - lastCalledTime) / 1000;
        lastCalledTime = performance.now();
        fps = 1 / delta;

        tick();
        draw(fps);
        requestAnimationFrame(tickFn);
    };
    tickFn();
}


function tick() {
    // Update color accuracy
    colorTracker.range = slider.value;
    // Circle Menu
    circleMenu.updateCapture(colorTracker.results);
    circleMenu.tick();
}

function draw(fps: number) {
    webcam.shotToCanvas(canvasElement);
    drawText(context, 20, 20, ceil(fps), {
        fillStyle: 'red'
    });
    circleMenu.draw(context);
}

init();