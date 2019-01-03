// Global
interface Point2D { x: number; y: number }

// FaceDetector
// https://wicg.github.io/shape-detection-api/#face-detection-api
declare class FaceDetector {
    constructor(faceDetectorOptions?: FaceDetectorOptions);

    detect(src: ImageBitmapSource): Promise<DetectedFace[]>;
}

interface FaceDetectorOptions {
    maxDetectedFaces?: number;
    fastMode?: boolean;
}

type LandmarkType = 'mouth' | 'eye' | 'nose';

interface Landmark {
    readonly locations: Point2D[];
    readonly type?: LandmarkType;
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
    landmarks: Landmark[];
}

// Barcode
// https://wicg.github.io/shape-detection-api/#barcode-detection-api
type BarcodeFormat = 'aztec' | 'code_128' | 'code_39' | 'code_93' | 'codabar' | 'data_matrix' | 'ean_13' | 'ean_8' | 'itf' | 'pdf417' | 'qr_code' | 'unknown' | 'upc_a' | 'upc_e';

interface DetectedBarcode {
    boundingBox: DOMRectReadOnly;
    rawValue: string;
    format: BarcodeFormat;
    cornerPoints: Point2D[];
}

declare class BarcodeDetector {
    readonly supportedFormats: BarcodeFormat[];

    constructor(barcodeDetectorOptions?: BarcodeDetectorOptions);

    detect(image: ImageBitmapSource): Promise<DetectedBarcode[]>;
}

interface BarcodeDetectorOptions {
    formats: BarcodeFormat[];
}

// TextDetector
// https://wicg.github.io/shape-detection-api/text.html

interface DetectedText {
    readonly boundingBox: DOMRectReadOnly;
    readonly rawValue: string;
    readonly cornerPoints: Point2D[];
}

declare class TextDetector {
    detect(image: ImageBitmapSource): Promise<DetectedText[]>;
}

// SpeechRecognition
// https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
declare class webkitSpeechRecognition extends SpeechRecognition {
}