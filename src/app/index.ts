import { Webcam } from "../lib/webcam";

const videoElement: HTMLVideoElement = document.querySelector('#video');
const buttonElement: HTMLButtonElement = document.querySelector('#button');
const canvasElement: HTMLCanvasElement = document.querySelector('#canvas');
let webcam: Webcam;
const faceDetector = new FaceDetector();
const context = canvasElement.getContext('2d');

async function init() {
    const current = new MinorityFaceDetector();

    webcam = await Webcam.of(videoElement);
    buttonElement.addEventListener('click', () => {
       
    });
    
    const tickFn = () => {
        current.tick();
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
        current.draw();
        requestAnimationFrame(tickFn);
    }
    tickFn();
}

class MinorityFaceDetector {
    private faces: DetectedFace[] = [];

    async tick() {
        this.faces = await faceDetector.detect(canvasElement);
    }

    async draw(){
        webcam.shotToCanvas(canvasElement);
        if(this.faces.length) {
            this.faces.forEach(face => {
                const {x, y, width, height} = face.boundingBox;
                context.strokeStyle = 'red';
                context.lineWidth = 10;
                context.strokeRect(x, y, width, height);
            });
        }
    }
}

init();
