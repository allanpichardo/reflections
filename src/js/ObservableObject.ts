import Draggable from "./base/Draggable";
import BoundingBox from "./interfaces/BoundingBox";
import p5 from "p5";

export default class ObservableObject extends Draggable {
    isReflection: boolean;

    constructor(p5: p5, roomBoundingBox: BoundingBox, isReflection: boolean) {
        const boundingBox = new BoundingBox(
            roomBoundingBox.center.x,
            roomBoundingBox.center.y,
            roomBoundingBox.width * 0.03,
            roomBoundingBox.height * 0.03
        );

        super(p5, boundingBox.position.x, boundingBox.position.y, boundingBox.width, boundingBox.height);
        this.isReflection = isReflection;
    }


    draw() {
        super.draw();

        this.p5.push();
        this.p5.stroke(0, this.isReflection ? 0 : 255);
        this.p5.fill(255, 0, 0, this.isReflection ? 20 : 255);
        this.p5.triangle(
            this.boundingBox.position.x,
            this.boundingBox.position.y,
            this.boundingBox.position.x + this.boundingBox.width,
            this.boundingBox.position.y,
            this.boundingBox.position.x + this.boundingBox.width / 2,
            this.boundingBox.position.y + this.boundingBox.height
        );
        this.p5.pop();
    }

}