export declare class Webcam {
    private element;
    private stream;
    private constructor();
    static of(element: HTMLVideoElement): Promise<Webcam>;
    shotToCanvas(canvas: HTMLCanvasElement, flip?: boolean): void;
}
