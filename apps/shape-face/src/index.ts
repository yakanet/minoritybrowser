import { Webcam } from "@minoritybrowser/webcam";

const videoElement: HTMLVideoElement = document.querySelector('#video');
const buttonElement: HTMLButtonElement = document.querySelector('#button');
const canvasElement: HTMLCanvasElement = document.querySelector('#canvas');
let webcam: Webcam;
const context = canvasElement.getContext('2d');

async function init() {
    webcam = await Webcam.of(videoElement);
    const current = new MinorityFaceDetector();
    
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

class MinorityFaceDetector {
    private faceDetector = new FaceDetector();

    private faces: DetectedFace[] = [];

    async tick() {
        try {
            this.faces = await this.faceDetector.detect(canvasElement);
        } catch (e) {
            console.error(e.message, e);
            this.faces = [];
        }
    }

    async draw() {
        webcam.shotToCanvas(canvasElement);
        if (this.faces.length) {
            this.faces.forEach(face => {
                const { x, y, width, height } = face.boundingBox;
                context.strokeStyle = 'red';
                context.lineWidth = 10;
                context.strokeRect(x, y, width, height);
            });
        }
    }
}

init();
