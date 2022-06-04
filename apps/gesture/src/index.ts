import {Webcam} from '@minoritybrowser/webcam';
import {load, PoseNet, Pose, Keypoint} from '@tensorflow-models/posenet';
import {Vector2D} from '@tensorflow-models/posenet/dist/types';
import '@tensorflow/tfjs-backend-webgl';

const videoElement: HTMLVideoElement = document.querySelector('#video');
const buttonElement: HTMLButtonElement = document.querySelector('#button');
const canvasElement: HTMLCanvasElement = document.querySelector('#canvas');
const previewElement: HTMLVideoElement = document.querySelector('#preview');
let webcam: Webcam;
const context = canvasElement.getContext('2d');

async function init() {
    webcam = await Webcam.of(videoElement);
    const current = new MinorityGesture()
    await current.load();

    buttonElement.addEventListener('click', () => {
    });

    const tickFn = () => {
        current.tick();
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
        current.draw();
        //requestAnimationFrame(tickFn);
        //tickFn();
    };
    //previewElvideo ement.play();
    previewElement.controls = true;
    previewElement.currentTime += 5;
    setInterval(() => tickFn(), 30);
}

class MinorityGesture {
    private posenet: PoseNet;
    private poses: Pose;

    load() {
        return load()
            .then(posenet => this.posenet = posenet);
    }

    async tick() {
        try {
            this.poses = await this.posenet.estimateSinglePose(canvasElement);
        } catch (e) {
            console.error(e.message, e);
            this.poses = null;
        }
    }

    draw() {
        webcam.shotToCanvas(canvasElement, true);

        if(this.poses) {
            const {rightWrist, rightElbow } = mapKeypoint(this.poses.keypoints);

            if(rightWrist) {
                context.fillStyle = 'blue';
                context.strokeStyle = 'blue';
                console.log(this.poses.keypoints.map(keypoint => keypoint.part).join(' '));
                context.fillRect(rightWrist.x, rightWrist.y, 10, 10);

                context.beginPath();
                context.moveTo(rightElbow.x, rightElbow.y);
                context.lineTo(rightWrist.x, rightWrist.y);
                context.stroke();
            }
        }
    }
}

function mapKeypoint(keypoints: Keypoint[]) {
    const result: {[key: string]: Vector2D} = {};
    keypoints.forEach(keypoint => {
        result[keypoint.part] = keypoint.position;
    });
    return result;
}

init();
