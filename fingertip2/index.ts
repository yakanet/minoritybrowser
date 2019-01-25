import {Webcam} from '../webcam/webcam';
import {ColorTracker} from './color-tracker';

const {pow, sqrt, acos, PI, cos, sin, atan2, tan} = Math;

const videoElement: HTMLVideoElement = document.querySelector('#video');
const canvasElement: HTMLCanvasElement = document.querySelector('#canvas');
const context: CanvasRenderingContext2D = canvasElement.getContext('2d');
const slider: HTMLInputElement = document.querySelector('#slider');
let webcam: Webcam;

const colorTracker = new ColorTracker();

canvasElement.addEventListener('click', (e) => {
    const ratioX = e.offsetX * canvasElement.width / canvasElement.offsetWidth;
    const ratioY = e.offsetY * canvasElement.height / canvasElement.offsetHeight;
    const pixel = context.getImageData(ratioX, ratioY, 1, 1).data;
    console.log({r: pixel[0], g: pixel[1], b: pixel[2]});
    colorTracker.color = {r: pixel[0], g: pixel[1], b: pixel[2]};
});

async function init() {
    webcam = await Webcam.of(videoElement);
    colorTracker.start(videoElement);

    let lastCalledTime = performance.now();
    let fps = 0;

    const tickFn = () => {

        const delta = (performance.now() - lastCalledTime) / 1000;
        lastCalledTime = performance.now();
        fps = 1 / delta;

        tick();
        // update the tracker value
        colorTracker.range = slider.value;
        const results = colorTracker.results;
        draw();
        context.fillStyle = 'red';
        context.fillText('' + Math.ceil(fps), 100, 100);
        let i = 0;
        for (let rect of results) {
            context.strokeStyle = `rgb(41, 144, 209)`;
            context.lineWidth = 1;
            //context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            const xCenter = rect.x + rect.width / 2;
            const yCenter = rect.y + rect.height / 2;
            drawCircle(context, xCenter, yCenter, 20);
            context.fillText('' + rect.x, xCenter, yCenter);
            context.fillText('' + ++i, xCenter, yCenter + 20);
        }
        if (results.length === 3) {
            context.lineWidth = 3;
            //https://math.stackexchange.com/a/1268279
            const [x1, x2, x3] = [0, 1, 2].map(i => results[i].x + results[i].width / 2);
            const [y1, y2, y3] = [0, 1, 2].map(i => results[i].y + results[i].height / 2);
            const points = new Point3(new Point(x1, y1), new Point(x2, y2), new Point(x3, y3));
            const circle = points.findCircle();
            const middle = points.findMiddleXPoint();

            //sqrt((x2 - x)² + (y2 - y)²)
            drawCircle(context, circle.center.x, circle.center.y, circle.radius - 20);
            drawCircle(context, circle.center.x, circle.center.y, circle.radius + 20);

            context.strokeStyle = `red`;
            drawCircle(context, circle.center.x, circle.center.y, 50);

            context.beginPath();
            context.moveTo(circle.center.x, circle.center.y);
            context.lineTo(middle.x, middle.y);
            context.stroke();

            context.strokeStyle = `green`;

            context.beginPath();
            context.moveTo(circle.center.x, circle.center.y);
            context.lineTo(circle.center.x + circle.radius, circle.center.y);
            context.stroke();

            context.strokeStyle = `white`;

            const angle = Point3.calculateAngle(circle.center, middle, new Point(circle.center.x + circle.radius, circle.center.y));

            console.log(angle);
            context.beginPath();
            console.log(angle);
            context.arc(circle.center.x, circle.center.y, 50, 0, angle, angle < 0);
            context.stroke();

        }
        requestAnimationFrame(tickFn);
    };
    tickFn();
}

class Point {
    constructor(public readonly x: number, public readonly y: number) {
    }
}

class Point3 {
    constructor(public p1: Point, public p2: Point, public p3: Point) {
    }

    public findCircle(): { radius: number, center: Point } {
        // https://math.stackexchange.com/a/1268279
        const [x1, y1] = [this.p1.x, this.p1.y];
        const [x2, y2] = [this.p2.x, this.p2.y];
        const [x3, y3] = [this.p3.x, this.p3.y];

        const mr = (y2 - y1) / (x2 - x1);
        const mt = (y3 - y2) / (x3 - x2);

        const x = (mr * mt * (y3 - y1) + mr * (x2 + x3) - mt * (x1 + x2)) / (2 * (mr - mt));
        const y = (y1 + y2) / 2 - (x - (x1 + x2) / 2) / mr;

        // sqrt((x2 - x)² + (y2 - y)²)
        const radius = sqrt(pow(x2 - x, 2) + pow(y2 - y, 2));
        return {
            center: new Point(x, y),
            radius
        };
    }

    public findMiddleXPoint(): Point {
        const {center} = this.findCircle();
        const adaptPi = (val: number) => val > PI ? 2 * PI - val : val; // take angle less than PI
        const angle12 = adaptPi(Math.abs(Point3.calculateAngle(center, this.p1, this.p2)));
        const angle13 = adaptPi(Math.abs(Point3.calculateAngle(center, this.p1, this.p3)));
        const angle23 = adaptPi(Math.abs(Point3.calculateAngle(center, this.p2, this.p3)));
        // Take the biggest angle and remove those point, the middle one should be the one left
        const maxAngle = Math.max(angle12, angle13, angle23);
        if (maxAngle === angle12) {
            return this.p3;
        }
        if (maxAngle === angle13) {
            return this.p2;
        }
        return this.p1;
    }

    public static calculateAngle(c: Point, p0: Point, p1: Point) {
        const v1x = p0.x - c.x;
        const v1y = p0.y - c.y;
        const v2x = p1.x - c.x;
        const v2y = p1.y - c.y;

        return atan2(v1y, v1x) - atan2(v2y, v2x);
    }
}

function tick() {
}

function draw() {
    webcam.shotToCanvas(canvasElement);
}

function drawCircle(context: CanvasRenderingContext2D, x: number, y: number, radius: number) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.stroke();
}

init();