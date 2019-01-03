
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

    public shotToCanvas(canvas: HTMLCanvasElement) {
        const context = canvas.getContext('2d');
        canvas.width = this.element.videoWidth;
        canvas.height = this.element.videoHeight;
        context.drawImage(this.element, 0, 0);
    }
}