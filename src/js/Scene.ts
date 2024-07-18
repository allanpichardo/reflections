import p5 from "p5";
import SceneObject from "./SceneObject";
import Room from "./Room";
import BoundingBox from "./BoundingBox";

/**
 * This is where the main sketch is built. This class is a controller
 * that manages the scene objects and the canvas.
 *
 * The scene is a 9 x 9 grid of rooms. The center room is the main room
 * and all other rooms are reserved canvas space for possible virtual
 * rooms.
 */
export default class Scene {
    p5: p5;
    sceneObjects: Map<string, SceneObject>;
    boundingBox: BoundingBox;
    scale: number = 6;

    constructor(p5: p5, width: number, height: number) {
        this.p5 = p5;
        this.boundingBox = new BoundingBox(0, 0, width, height);
        this.sceneObjects = new Map<string, SceneObject>();

        this.buildScene();
    }

    buildScene(): void {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                const isVirtual = !(i === 4 && j === 4);
                const room = new Room(this.p5, (i * Room.SIZE + Room.SIZE / 2), (j * Room.SIZE + Room.SIZE / 2), isVirtual);
                this.sceneObjects.set(`${i},${j}`, room);
            }
        }
    }

    calculateScale(): void {
        this.p5.translate(this.boundingBox.center.x, this.boundingBox.center.y);
        this.p5.scale(this.scale);
        this.p5.translate(-this.boundingBox.center.x, -this.boundingBox.center.y);
    }

    setup(): void {
        this.p5.createCanvas(this.boundingBox.width, this.boundingBox.height);
        this.sceneObjects.forEach(sceneObject => sceneObject.setup());
    }

    draw(): void {
        this.scale = Math.abs(Math.sin(this.p5.frameCount * 0.01) * 6);
        this.calculateScale();
        this.sceneObjects.forEach(sceneObject => sceneObject.draw());
    }
}