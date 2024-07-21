import p5 from "p5";
import SceneObject from "./interfaces/SceneObject";
import Room from "./Room";
import BoundingBox from "./interfaces/BoundingBox";

/**
 * This is where the main sketch is built. This class is a controller
 * that manages the scene objects and the canvas.
 *
 * The scene is a 5 x 5 grid of rooms. The center room is the main room
 * and all other rooms are reserved canvas space for possible virtual
 * rooms.
 */
export default class Scene {
    p5: p5;
    sceneObjects: Map<string, SceneObject>;
    boundingBox: BoundingBox;

    constructor(p5: p5, width: number, height: number, roomsPerRow: number, roomSize: number) {
        this.p5 = p5;
        this.boundingBox = new BoundingBox(0, 0, width, height);
        this.sceneObjects = new Map<string, SceneObject>();

        this.buildScene(roomsPerRow, roomSize);
    }

    buildScene(roomsPerRow: number, roomSize: number): void {
        for(let i = 0; i < roomsPerRow; i++) {
            for(let j = 0; j < roomsPerRow; j++) {
                const mid = Math.floor(roomsPerRow / 2);
                const isVirtual = !(i === mid && j === mid);
                const room = new Room(this.p5, (i * roomSize + roomSize / 2), (j * roomSize + roomSize / 2), roomSize, isVirtual);
                this.sceneObjects.set(`${i},${j}`, room);
            }
        }
    }

    setup(): void {
        this.p5.createCanvas(this.boundingBox.width, this.boundingBox.height);
        this.sceneObjects.forEach(sceneObject => sceneObject.setup());
        this.p5.mouseClicked = this.onClick.bind(this);
        this.p5.mousePressed = this.onMousePressed.bind(this);
        this.p5.mouseReleased = this.onMouseReleased.bind(this);
    }

    onClick(): void {
        this.sceneObjects.forEach(obj => {
            obj.onClick();
        });
    }

    onMousePressed(): void {
        this.sceneObjects.forEach(sceneObject => sceneObject.onMousePressed());
    }

    onMouseReleased(): void {
        this.sceneObjects.forEach(sceneObject => sceneObject.onMouseReleased());
    }

    draw(): void {
        this.sceneObjects.forEach(sceneObject => sceneObject.draw());
    }
}