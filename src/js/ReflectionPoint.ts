import Draggable from "./base/Draggable";
import p5 from "p5";
import BoundingBox from "./interfaces/BoundingBox";

export default class ReflectionPoint extends Draggable {

    constructor(p5: p5, mirrorBoundingBox: BoundingBox) {
        const size = Math.min(mirrorBoundingBox.width, mirrorBoundingBox.height) * 1.2;

        const boundingBox = new BoundingBox(
            mirrorBoundingBox.position.x + mirrorBoundingBox.width / 2,
            mirrorBoundingBox.position.y + mirrorBoundingBox.height / 2,
            size,
            size
        );

        super(p5, boundingBox.position.x, boundingBox.position.y, boundingBox.width, boundingBox.height);
    }

    show(): void {
        this.boundingBox.position.x = this.p5.mouseX;
        this.boundingBox.position.y = this.p5.mouseY;

        this.p5.push();
        this.p5.stroke(255);
        this.p5.strokeWeight(2);
        this.p5.fill(255, 0, 0);
        this.p5.ellipse(this.p5.mouseX, this.p5.mouseY, this.boundingBox.width, this.boundingBox.height);
        this.p5.pop();
    }
}