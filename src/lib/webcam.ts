
export class Webcam {

    private constructor(private element: HTMLVideoElement, private stream: MediaStream) {
        this.element.srcObject = stream;
        this.element.autoplay = true;
        this.element.muted = true;
    }

    public static of(element: HTMLVideoElement): Promise<Webcam> {
        return navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        })
        .then(stream => new Webcam(element, stream))
        .then(async (webcam) => {
            await new Promise((resolve, _) => {
                webcam.element.addEventListener('loadeddata', resolve);
            });
            return webcam;
        });
    }

    public shotToCanvas(canvas: HTMLCanvasElement) {
        const context = canvas.getContext('2d');
        canvas.width = this.element.videoWidth;
        canvas.height = this.element.videoHeight;
        context.drawImage(this.element, 0, 0);
    }
}