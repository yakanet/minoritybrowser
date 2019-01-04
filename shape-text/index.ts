import { Webcam } from "webcam";

const videoElement: HTMLVideoElement = document.querySelector('#video');
const buttonElement: HTMLButtonElement = document.querySelector('#button');
const canvasElement: HTMLCanvasElement = document.querySelector('#canvas');
let webcam: Webcam;
const context = canvasElement.getContext('2d');

async function init() {
    webcam = await Webcam.of(videoElement);
    const current = new MinorityText();
    
    buttonElement.addEventListener('click', () => { });

    const tickFn = () => {
        current.tick();
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
        current.draw();
        //requestAnimationFrame(tickFn);
    }
    //tickFn();
    setInterval(() => tickFn(), 30);
}

class MinorityText {
    private textDetector: TextDetector;
    private texts: DetectedText[] = [];

    constructor() {
        this.textDetector = new TextDetector();
    }

    async tick() {
        try {
            this.texts = await this.textDetector.detect(canvasElement);
        } catch (e) {
            console.error(e.message, e);
            this.texts = [];
        }
    }

    draw() {
        webcam.shotToCanvas(canvasElement);
        if(this.texts && this.texts.length) {
            this.texts.forEach(text => {
                const { x, y, width, height } = text.boundingBox;
                context.strokeStyle = 'red';
                context.lineWidth = 10;
                context.strokeRect(x, y, width, height);
                context.fillText(text.rawValue, x, y);
            });
        }
    }
}

init();
