import '../css/index.css';
import p5 from "p5";
import Scene from "./Scene";

function startSketch(roomsPerRow: number, container: HTMLElement) {
    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }

    new p5((p5: p5) => {
        const canvasSize = 1000;
        const roomSize = canvasSize / roomsPerRow;
        const scene = new Scene(p5, canvasSize, canvasSize, roomsPerRow, roomSize);
        p5.setup = scene.setup.bind(scene);
        p5.draw = scene.draw.bind(scene);
    }, container);
}

function main(): void {
    const container = document.querySelector('.sandbox') as HTMLElement;
    const reflectionSlider = document.querySelector('.controls input') as HTMLInputElement;

    reflectionSlider.addEventListener('input', (e: Event) => {
        startSketch(parseInt(reflectionSlider.value), container);
    });

    startSketch(1, container);
}

main();