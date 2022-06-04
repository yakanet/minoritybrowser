
export class Webcam {

    private constructor(private element: HTMLVideoElement, private stream: MediaStream) {
        this.element.srcObject = stream;
        this.element.autoplay = true;
        this.element.muted = true;
    }

    public static of(element: HTMLVideoElement): Promise<Webcam> {
        return navigator.mediaDevices.getUserMedia({
            video: {facingMode: {ideal: 'environment'}},
            audio: false
        })
        .then(stream => new Webcam(element, stream))
        .then(webcam => new Promise<Webcam>((resolve, _) => 
            webcam.element.addEventListener('loadeddata', () => resolve(webcam)))
        );
    }

    public shotToCanvas(canvas: HTMLCanvasElement, flip = false) {
        const context = canvas.getContext('2d');
        canvas.width = this.element.videoWidth;
        canvas.height = this.element.videoHeight;
        if(flip) {
            context.save();
            context.scale(-1, 1);
            context.translate(-canvas.width, 0);
            context.drawImage(this.element, 0, 0);
            context.restore();
        } else {
            context.drawImage(this.element, 0, 0);
        }
    }
}