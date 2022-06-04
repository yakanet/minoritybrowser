import 'tracking';

const {pow, sqrt} = Math;

export class ColorTracker {
    // let's start with a yellow color
    private _color: RgbColor = {r: 199, g: 216, b: 111};
    private _range = 60;
    private readonly tracker: tracking.ColorTracker;
    private _results: tracking.TrackRect[] = [];

    constructor() {
        this.registerColor();
        this.tracker = new tracking.ColorTracker('pointer');
        this.tracker.on('track', e => this._results = e.data);
    }

    public get results() {
        return this._results;
    }

    public set color(color: RgbColor) {
        this._color = color;
    }

    public get color() {
        return this._color;
    }

    public start(videoElement: HTMLVideoElement) {
        tracking.track(videoElement, this.tracker, {camera: true});
    }

    public set range(value: string) {
        this._range = parseInt(value);
    }

    private registerColor() {
        tracking.ColorTracker.registerColor('pointer', (r, g, b) =>
            getColorDistance(this._color, {r: r, g: g, b: b}) < this._range
        );
    }
}

export interface RgbColor {
    r: number;
    g: number;
    b: number;
}

// Euclidian distance between the target color and the actual color
const getColorDistance = (target: RgbColor, actual: RgbColor) => sqrt(
    pow(target.r - actual.r, 2) + pow(target.g - actual.g, 2) + pow(target.b - actual.b, 2)
);
