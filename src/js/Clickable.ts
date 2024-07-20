import BoundingBox from "./BoundingBox";
import SceneObject from "./SceneObject";
import p5 from "p5";
import Point from "./Point";

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
        this.p5.mouseClicked = () => this.handleClick();
    }

    draw() {
        // do nothing
    }

    handleClick(): void {
        if(this.isMouseOver){
            this.isActive = !this.isActive;
        }
    }
}