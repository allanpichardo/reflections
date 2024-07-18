import Point from "./Point";
import BoundingBox from "./BoundingBox";
import SceneObject from "./SceneObject";
import p5 from "p5";

export default class Draggable implements SceneObject {
    p5: p5;
    boundingBox: BoundingBox;
    position: Point;
    offset: Point;
    isDragging: boolean = false;
    isRollover: boolean = false;

    constructor(p5: p5, x: number, y: number, width: number, height: number) {
        this.p5 = p5;
        this.boundingBox = new BoundingBox(x, y, width, height);
        this.position = { x, y };
        this.offset = { x: 0, y: 0 };
    }

    setup(): void {
        this.p5.mousePressed(this.handleMousePressed.bind(this));
        this.p5.mouseReleased(this.handleMouseReleased.bind(this));
    }

    draw(): void {
        if (this.isDragging) {
            this.position.x = this.p5.mouseX + this.offset.x;
            this.position.y = this.p5.mouseY + this.offset.y;
        }
    }

    handleMousePressed(): void {
        if (this.isMouseOver()) {
            this.isDragging = true;
            this.offset.x = this.position.x - this.p5.mouseX;
            this.offset.y = this.position.y - this.p5.mouseY;
        }
    }

    handleMouseReleased(): void {
        this.offset = { x: 0, y: 0 };
        this.isDragging = false;
    }

    isMouseOver(): boolean {
        return this.boundingBox.contains({
            x: this.p5.mouseX,
            y: this.p5.mouseY
        });
    }
}