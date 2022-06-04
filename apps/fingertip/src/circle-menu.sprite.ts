import {drawArc, drawCircle, drawRectangle, drawLine, drawText} from './draw-util';
import {SpriteModel} from './sprite.model';
import {p, Point, Point3, radToDeg} from './geo-util';

const {PI} = Math;

export class CircleMenuSprite extends SpriteModel {
    /**
     * Captured coordinate
     */
    private captures: tracking.TrackRect[];

    private captureType: 'SINGLE' | 'TREE_POINT' = null;
    /**
     * That the coordinate of the circle passing through 3 captured points
     */
    private circle: { radius: number; center: Point };
    /**
     * That the point in the middle of the 3 captured points
     */
    private middlePoint: Point;
    /**
     * Angle between the middlePoint and the normalPoint inside the circle
     */
    private openAngle: number;
    /**
     * Easier for calculation, use the point (1, 0) on the circle
     */
    private normalPoint: Point;

    updateCapture(capture: tracking.TrackRect[]) {
        this.captures = capture;
    }

    draw(context: CanvasRenderingContext2D) {
        for (let capture of this.captures) {
            const xCenter = capture.x + capture.width / 2;
            const yCenter = capture.y + capture.height / 2;
            /*
            drawCircle(context, xCenter, yCenter, 20, {
                strokeStyle: `rgb(41, 144, 209)`,
                lineWidth: 10
            });
            */
            drawRectangle(context, capture.x , capture.y, capture.width, capture.height, {
                strokeStyle: `rgb(41, 144, 209)`,
                lineWidth: 2
            })
        }
        /*
        if (this.captureType === 'TREE_POINT') {
            this.drawPoints(context);
        }
        */
    }

    tick(): void {
        this.captureType = 'SINGLE';
        if (this.captures.length === 3) {
            this.captureType = 'TREE_POINT';
            const [x1, x2, x3] = [0, 1, 2].map(i => this.captures[i].x + this.captures[i].width / 2);
            const [y1, y2, y3] = [0, 1, 2].map(i => this.captures[i].y + this.captures[i].height / 2);

            // Calculate circle, points and angle in order to draw
            const points = new Point3(p(x1, y1), p(x2, y2), p(x3, y3));
            this.circle = points.findCircle();
            this.middlePoint = points.findMiddlePoint();
            this.normalPoint = p(this.circle.center.x + this.circle.radius, this.circle.center.y);
            this.openAngle = Point3.calculateAngle(this.circle.center, this.normalPoint, this.middlePoint);
        }
    }

    private drawRectangle(context: CanvasRenderingContext2D, xCenter: number, yCenter: number, size: number) {
        
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

        drawArc(context, circle.center.x, circle.center.y, 50, 0, angle, angle < 0, {
            lineWidth,
            strokeStyle: `white`
        });

        drawLine(context, circle.center.x, circle.center.y, normal.x, normal.y, {
            lineWidth,
            strokeStyle: `green`
        });

        drawLine(context, circle.center.x, circle.center.y, circle.center.x, circle.center.y - circle.radius, {
            lineWidth,
            strokeStyle: `green`
        });

        drawLine(context, circle.center.x, circle.center.y, middle.x, middle.y, {
            lineWidth,
            strokeStyle: 'red'
        });

        drawText(context, circle.center.x + 10, circle.center.y - 10, Math.ceil(radToDeg(this.normalizedAngle)) + ' °', {
            fillStyle: 'red'
        });
    }

    /**
     * Return the angle with the middle point and the (0, 1) point on the circle
     * @return angle in radian [-PI, PI]
     */
    get normalizedAngle() {
        if (this.captureType === 'SINGLE') {
            return 0;
        }
        if (this.openAngle > PI / 2) {
            return this.openAngle - 2 * PI + PI / 2;
        }
        return this.openAngle + PI / 2;
    }
}