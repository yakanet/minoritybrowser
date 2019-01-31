const {pow, sqrt, abs, PI, cos, sin, atan2, tan} = Math;

export class Point {
    constructor(public readonly x: number, public readonly y: number) {
    }
}

export function p(x: number, y: number) {
    return new Point(x, y);
}

export class Point3 {
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

    public findMiddlePoint(): Point {
        const {center} = this.findCircle();
        const positiveAngle = (val: number) => val > PI ? 2 * PI - val : val; // take angle less than PI
        const angle12 = positiveAngle(abs(Point3.calculateAngle(center, this.p1, this.p2)));
        const angle13 = positiveAngle(abs(Point3.calculateAngle(center, this.p1, this.p3)));
        const angle23 = positiveAngle(abs(Point3.calculateAngle(center, this.p2, this.p3)));
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

    /**
     * Give an angle between -PI and PI
     * @param c
     * @param p0
     * @param p1
     */
    public static calculateAngle(c: Point, p0: Point, p1: Point) {
        // https://stackoverflow.com/questions/1211212/how-to-calculate-an-angle-from-three-points
        const v1x = p0.x - c.x;
        const v1y = p0.y - c.y;
        const v2x = p1.x - c.x;
        const v2y = p1.y - c.y;

        return atan2(v2y, v2x) - atan2(v1y, v1x);
    }
}

export function radToDeg(value: number) {
    return value * 180 / PI;
}

export function degToRad(value: number) {
    return value * PI / 180;
}