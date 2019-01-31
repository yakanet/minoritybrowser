interface CanvasStyle {
    strokeStyle?: string;
    fillStyle?: string;
    lineWidth?: number;
}

export function drawText(context: CanvasRenderingContext2D, x: number, y: number, text: any, options: CanvasStyle) {
    for (let key in options) {
        context[key] = options[key];
    }
    context.fillText('' + text, x, y);
}

export function drawLine(context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, options: CanvasStyle) {
    for (let key in options) {
        context[key] = options[key];
    }
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}

export function drawCircle(context: CanvasRenderingContext2D, x: number, y: number, radius: number, options: CanvasStyle) {
    for (let key in options) {
        context[key] = options[key];
    }
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.stroke();
}


export function drawArc(context: CanvasRenderingContext2D, x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean, options: CanvasStyle) {
    for (let key in options) {
        context[key] = options[key];
    }
    context.beginPath();
    context.arc(x, y, radius, startAngle, endAngle, anticlockwise);
    context.stroke();
}
