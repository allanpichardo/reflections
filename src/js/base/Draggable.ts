import Point from "../interfaces/Point";
import BoundingBox from "../interfaces/BoundingBox";
import SceneObject from "../interfaces/SceneObject";
import p5 from "p5";

export default class Draggable implements SceneObject {
    p5: p5;
    boundingBox: BoundingBox;
    offset: Point;
    isDragging: boolean = false;
    isRollover: boolean = false;

    constructor(p5: p5, x: number, y: number, width: number, height: number) {
        this.p5 = p5;
        this.boundingBox = new BoundingBox(x, y, width, height);
        this.offset = { x: 0, y: 0 };
    }

    setup(): void {
        // do nothing
    }

    draw(): void {
        if(this.boundingBox.contains({ x: this.p5.mouseX, y: this.p5.mouseY })) {
            this.isRollover = true;
        } else {
            this.isRollover = false;
        }

        if (this.isDragging) {
            this.boundingBox.position.x = this.p5.mouseX + this.offset.x;
            this.boundingBox.position.y = this.p5.mouseY + this.offset.y;
        }
    }

    onClick() {
        // do nothing
    }

    onMousePressed() {
        if (this.boundingBox.contains({
            x: this.p5.mouseX,
            y: this.p5.mouseY
        })) {
            this.isDragging = true;
            this.offset.x = this.boundingBox.position.x - this.p5.mouseX;
            this.offset.y = this.boundingBox.position.y - this.p5.mouseY;
        }
    }

    onMouseReleased() {
        this.offset = { x: 0, y: 0 };
        this.isDragging = false;
    }
}