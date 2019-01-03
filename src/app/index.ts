import { Webcam } from "../lib/webcam";

const videoElement: HTMLVideoElement = document.querySelector('#video');
const buttonElement: HTMLButtonElement = document.querySelector('#button');
const canvasElement: HTMLCanvasElement = document.querySelector('#canvas');
let webcam: Webcam;
const context = canvasElement.getContext('2d');

async function init() {
    webcam = await Webcam.of(videoElement);
    const current = new MinoritySpeech();
    //const current = new MinorityFaceDetector();
    //const current = new MinorityText();
    //const current = new MinorityBarcode();

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
