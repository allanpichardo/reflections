import SceneObject from "./SceneObject";
import BoundingBox from "./BoundingBox";
import p5 from "p5";

export default class Room implements SceneObject {

    static get SIZE(): number {
        return 100;
    }

    p5: p5;
    boundingBox: BoundingBox;
    isVirtual: boolean;

    constructor(p5: p5, x: number, y: number, isVirtual: boolean = false) {
        this.p5 = p5;
        this.boundingBox = new BoundingBox(x - Room.SIZE / 2, y - Room.SIZE / 2, Room.SIZE, Room.SIZE);
        this.isVirtual = isVirtual;
    }

    setup(): void {

    }

    draw(): void {
        this.p5.push();
        this.p5.stroke(this.isVirtual ? 200 : 0, this.isVirtual ? 127 : 255);
        this.p5.strokeWeight(1);
        this.p5.fill(this.isVirtual ? 250 : 255, this.isVirtual ? 127 : 255);
        this.p5.rect(this.boundingBox.position.x, this.boundingBox.position.y, this.boundingBox.width, this.boundingBox.height);
        this.p5.pop();
    }
}