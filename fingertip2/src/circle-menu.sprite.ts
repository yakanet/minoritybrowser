import {drawArc, drawCircle, drawLine, drawText} from './draw-util';
import {SpriteModel} from './sprite.model';
import {p, Point, Point3, radToDeg} from './geo-util';

const {PI} = Math;

export class CircleMenuSprite extends SpriteModel {
    private captures: tracking.TrackRect[];
    private captureType: 'SINGLE' | 'TREE_POINT' = null;
    private circle: { radius: number; center: Point };
    private middlePoint: Point;
    private openAngle: number;
    private normalPoint: Point;

    updateCapture(capture: tracking.TrackRect[]) {
        this.captures = capture;
    }

    draw(context: CanvasRenderingContext2D) {
        for (let capture of this.captures) {
            const xCenter = capture.x + capture.width / 2;
            const yCenter = capture.y + capture.height / 2;
            drawCircle(context, xCenter, yCenter, 20, {
                strokeStyle: `rgb(41, 144, 209)`,
                lineWidth: 1
            });
        }
        if (this.captureType === 'TREE_POINT') {
            this.drawPoints(context);
        }
    }

    tick(): void {
        this.captureType = 'SINGLE';
        if (this.captures.length === 3) {
            this.captureType = 'TREE_POINT';
            const [x1, x2, x3] = [0, 1, 2].map(i => this.captures[i].x + this.captures[i].width / 2);
            const [y1, y2, y3] = [0, 1, 2].map(i => this.captures[i].y + this.captures[i].height / 2);
            const points = new Point3(p(x1, y1), p(x2, y2), p(x3, y3));
            this.circle = points.findCircle();
            this.middlePoint = points.findMiddlePoint();
            this.normalPoint = p(this.circle.center.x + this.circle.radius, this.circle.center.y);
            this.openAngle = Point3.calculateAngle(this.circle.center, this.normalPoint, this.middlePoint);
        }
    }

    private drawPoints(context: CanvasRenderingContext2D) {
        const circle = this.circle;
        const middle = this.middlePoint;
        const angle = this.openAngle;
        const normal = this.normalPoint;
        const lineWidth = 3;

        drawCircle(context, circle.center.x, circle.center.y, circle.radius - 20, {
            lineWidth,
            strokeStyle: `rgb(41, 144, 209)`
        });
        drawCircle(context, circle.center.x, circle.center.y, circle.radius + 20, {
            lineWidth,
            strokeStyle: `rgb(41, 144, 209)`
        });
        drawCircle(context, circle.center.x, circle.center.y, 50, {
            lineWidth,
            strokeStyle: `red`
        });

        drawLine(context, circle.center.x, circle.center.y, middle.x, middle.y, {
            lineWidth,
            fillStyle: 'red'
        });

        drawLine(context, circle.center.x, circle.center.y, normal.x, normal.y, {
            lineWidth,
            strokeStyle: `green`
        });

        drawArc(context, circle.center.x, circle.center.y, 50, 0, angle, angle < 0, {
            lineWidth,
            strokeStyle: `white`
        });

        drawText(context, circle.center.x + 10, circle.center.y - 10, Math.ceil(radToDeg(angle)) + ' °', {
            fillStyle: 'red'
        });
    }
}