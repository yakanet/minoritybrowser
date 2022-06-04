import { Webcam } from "@minoritybrowser/webcam";

const videoElement: HTMLVideoElement = document.querySelector('#video');
const buttonElement: HTMLButtonElement = document.querySelector('#button');
const canvasElement: HTMLCanvasElement = document.querySelector('#canvas');
let webcam: Webcam;
const context = canvasElement.getContext('2d');

async function init() {
    webcam = await Webcam.of(videoElement);
    const current = new MinorityBarcode();
    
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

class MinorityBarcode {
    private barcodeDetector: BarcodeDetector;
    private barcodes: DetectedBarcode[];

    
    constructor() {
        this.barcodeDetector = new BarcodeDetector();
    }

    async tick() {
        try {
            this.barcodes = await this.barcodeDetector.detect(canvasElement);
        } catch (e) {
            console.error(e.message, e);
            this.barcodes = [];
        }
    }

    draw() {
        webcam.shotToCanvas(canvasElement);
        if(this.barcodes && this.barcodes.length) {
            this.barcodes.forEach(barcode => {
                const { x, y, width, height } = barcode.boundingBox;
                context.fillStyle = 'white';
                context.fillRect(x, y, width, Math.max(height, 100));
                context.fillStyle = 'black';
                context.fillText(barcode.rawValue, x, y + 15);
                console.log(barcode);
            });
        }
    }
}

init();