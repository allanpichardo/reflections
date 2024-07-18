import p5 from "p5";
import SceneObject from "./SceneObject";
import Room from "./Room";
import BoundingBox from "./BoundingBox";

/**
 * This is where the main sketch is built. This class is a controller
 * that manages the scene objects and the canvas.
 *
 * The scene is a 3 x 3 grid of rooms. The center room is the main room
 */
export default class Scene {
    p5: p5;
    sceneObjects: Map<string, SceneObject>;
    boundingBox: BoundingBox;

    constructor(p5: p5, width: number, height: number) {
        this.p5 = p5;
        this.boundingBox = new BoundingBox(0, 0, width, height);
        this.sceneObjects = new Map<string, SceneObject>();

        this.buildScene();
    }

    buildScene(): void {
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                const room = new Room(this.p5, i * 250 + 125, j * 250 + 125, i === 1 && j === 1);
                this.sceneObjects.set(`${i},${j}`, room);
            }
        }
    }

    setup(): void {
        this.p5.createCanvas(this.boundingBox.width, this.boundingBox.height);
        this.sceneObjects.forEach(sceneObject => sceneObject.setup());
    }

    draw(): void {
        this.sceneObjects.forEach(sceneObject => sceneObject.draw());
    }
}