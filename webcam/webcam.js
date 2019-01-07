"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Webcam = /** @class */ (function () {
    function Webcam(element, stream) {
        this.element = element;
        this.stream = stream;
        this.element.srcObject = stream;
        this.element.autoplay = true;
        this.element.muted = true;
    }
    Webcam.of = function (element) {
        return navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' } },
            audio: false
        })
            .then(function (stream) { return new Webcam(element, stream); })
            .then(function (webcam) { return new Promise(function (resolve, _) {
            return webcam.element.addEventListener('loadeddata', function () { return resolve(webcam); });
        }); });
    };
    Webcam.prototype.shotToCanvas = function (canvas, flip) {
        if (flip === void 0) { flip = false; }
        var context = canvas.getContext('2d');
        canvas.width = this.element.videoWidth;
        canvas.height = this.element.videoHeight;
        if (flip) {
            context.save();
            context.scale(-1, 1);
            context.translate(-canvas.width, 0);
            context.drawImage(this.element, 0, 0);
            context.restore();
        }
        else {
            context.drawImage(this.element, 0, 0);
        }
    };
    return Webcam;
}());
exports.Webcam = Webcam;
