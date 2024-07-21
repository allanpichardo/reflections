import BoundingBox from "./interfaces/BoundingBox";
import p5 from "p5";
import Draggable from "./base/Draggable";

export default class Eyeball extends Draggable {
    isReflection: boolean;

    constructor(p5: p5, roomBoundingBox: BoundingBox, isReflection: boolean) {
        const boundingBox = new BoundingBox(
            roomBoundingBox.center.x,
            roomBoundingBox.center.y,
            roomBoundingBox.width * 0.04,
            roomBoundingBox.height * 0.04
        );

        super(p5, boundingBox.position.x, boundingBox.position.y, boundingBox.width, boundingBox.height);
        this.isReflection = isReflection;
        this.boundingBox.position.x -= this.boundingBox.width * 8;
        this.boundingBox.position.y -= this.boundingBox.height * 8;
    }

    draw() {
        super.draw();

        this.p5.push();
        this.p5.fill(0, this.isReflection ? 10 : 255);
        this.p5.stroke(0, this.isReflection ? 0 : 255);
        this.p5.ellipse(
            this.boundingBox.position.x + this.boundingBox.width / 2,
            this.boundingBox.position.y + this.boundingBox.height / 2,
            this.boundingBox.width,
            this.boundingBox.height
        );
    }
}