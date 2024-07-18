import SceneObject from "./SceneObject";
import BoundingBox from "./BoundingBox";
import p5 from "p5";

export default class Room implements SceneObject {
    p5: p5;
    boundingBox: BoundingBox;
    isVirtual: boolean;

    constructor(p5: p5, x: number, y: number, isVirtual: boolean = false) {
        this.p5 = p5;
        this.boundingBox = new BoundingBox(x - 125, y - 125, 250, 250);
        this.isVirtual = isVirtual;
    }

    setup(): void {

    }

    draw(): void {
        this.p5.stroke(0, this.isVirtual ? 127 : 255);
        this.p5.strokeWeight(1);
        this.p5.fill(255, this.isVirtual ? 127 : 255);
        this.p5.rect(this.boundingBox.position.x, this.boundingBox.position.y, this.boundingBox.width, this.boundingBox.height);
    }
}