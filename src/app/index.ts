import { Webcam } from "../lib/webcam";

const videoElement: HTMLVideoElement = document.querySelector('#video');
const buttonElement: HTMLButtonElement = document.querySelector('#button');
const canvasElement: HTMLCanvasElement = document.querySelector('#canvas');
let webcam: Webcam;
const faceDetector = new FaceDetector();
const context = canvasElement.getContext('2d');

async function init() {
    webcam = await Webcam.of(videoElement);
    const current = new MinoritySpeech();
    //const current = new MinorityFaceDetector();

    buttonElement.addEventListener('click', () => { });

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
        try {
            this.faces = await faceDetector.detect(canvasElement);
        } catch (e) {
            console.error(e);
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

class MinoritySpeech {
    constructor() {
        var msg = new SpeechSynthesisUtterance('Bonjour à tous');

        msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name.indexOf('français') > -1 })[0];
        speechSynthesis.getVoices().forEach(function (voice) {
            console.log(voice.name, voice.default ? voice.default : '');
        });
        speechSynthesis.speak(msg);

        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'fr';
        recognition.onresult = (event) => {
            console.log(event.results[0][0]);
        };
        recognition.start();
        console.log(recognition);

    }

    tick() {

    }

    draw() {

    }
}

init();
