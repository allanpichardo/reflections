import BoundingBox from "../interfaces/BoundingBox";
import SceneObject from "../interfaces/SceneObject";
import p5 from "p5";

export default class Clickable implements SceneObject {
    p5: p5;
    boundingBox: BoundingBox;
    isActive: boolean = false;
    isMouseOver: boolean = false;

    constructor(p5: p5, boundingBox: BoundingBox, active: boolean = false) {
        this.p5 = p5;
        this.boundingBox = boundingBox;
        this.isActive = active;
    }

    setup(): void {
        // this.p5.mouseClicked = () => this.handleClick();
    }

    draw() {
        this.isMouseOver = this.boundingBox.contains({x: this.p5.mouseX, y: this.p5.mouseY});
        if(this.isMouseOver) {
            this.p5.cursor(this.p5.HAND);
        } else {
            this.p5.cursor(this.p5.ARROW);
        }
    }

    onClick() {
        if(this.isMouseOver) {
            this.isActive = !this.isActive;
        }
    }

    onMousePressed() {
        // do nothing
    }

    onMouseReleased() {
        // do nothing
    }
}