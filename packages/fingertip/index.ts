import {Webcam} from '../webcam'
import {ColorTracker} from './src/color-tracker';
import {CircleMenuSprite} from './src/circle-menu.sprite';
import {PhotoBook} from './src/photo-manager';
import {drawText} from './src/draw-util';

const {ceil} = Math;

const videoElement = document.querySelector<HTMLVideoElement>('#video')!;
const canvasElement = document.querySelector<HTMLCanvasElement>('#canvas')!;
const context = canvasElement.getContext('2d')!;
const slider = document.querySelector<HTMLInputElement>('#slider')!;
const wrapperElement = document.querySelector<HTMLDivElement>('.wrapper')!;
let webcam: Webcam;

(document.querySelector('#toggleSettings') as HTMLButtonElement).onclick = (_event) => {
    document.body.classList.toggle('settings');
};

const photoBook = new PhotoBook([...Array(10).keys()].map(
    (_, i) => `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${Math.ceil(Math.random() * 90 + 1)}.jpg`,
));
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
    photoBook.initLayout(wrapperElement);
    setTimeout(() => photoBook.zoom(0), 1);

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


let lastAction = performance.now();

function tick() {
    // Update color accuracy
    colorTracker.range = slider.value;
    // Circle Menu
    circleMenu.updateCapture(colorTracker.results);
    circleMenu.tick();

    //
    if (circleMenu.normalizedAngle > (Math.PI / 2) && (performance.now() - lastAction) > 1000) {
        lastAction = performance.now();
        photoBook.zoom(photoBook.selectedPhotoIndex - 1);
    }
    if (circleMenu.normalizedAngle < (-Math.PI / 2) && (performance.now() - lastAction) > 1000) {
        lastAction = performance.now();
        photoBook.zoom(photoBook.selectedPhotoIndex + 1);
    }
}

function draw(fps: number) {
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    context.globalAlpha = 0.1;
    webcam.shotToCanvas(canvasElement);
    drawText(context, 20, 20, ceil(fps), {
        fillStyle: `rgb(${colorTracker.color.r}, ${colorTracker.color.g}, ${colorTracker.color.b})`
    });
    circleMenu.draw(context);
}

init();