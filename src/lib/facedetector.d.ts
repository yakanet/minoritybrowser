declare class FaceDetector {
    detect(src: HTMLImageElement | HTMLCanvasElement): Promise<DetectedFace[]>;
}

interface DetectedFace {
    boundingBox: {
        readonly bottom: number;
        readonly height: number;
        readonly left: number;
        readonly right: number;
        readonly top: number;
        readonly width: number;
        readonly x: number;
        readonly y: number;
    },
    landmarks: any[];
}
