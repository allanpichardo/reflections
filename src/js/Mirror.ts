import BoundingBox from "./interfaces/BoundingBox";
import p5 from "p5";
import Clickable from "./base/Clickable";

export default class Mirror extends Clickable {
    static get HEIGHT(): number {
        return 3;
    }

    p5: p5;
    boundingBox: BoundingBox;
    isActive: boolean = false;

    constructor(p5: p5, position: 'top' | 'bottom' | 'left' | 'right', roomBoundingBox: BoundingBox, active: boolean = false){

        const height = roomBoundingBox.height * 0.03;
        let boundingBox: BoundingBox = new BoundingBox(0, 0, 0, 0);
        switch(position) {
            case 'top':
                boundingBox = new BoundingBox(
                    roomBoundingBox.position.x,
                    roomBoundingBox.position.y,
                    roomBoundingBox.width,
                    height
                );
                break;
            case 'bottom':
                boundingBox = new BoundingBox(
                    roomBoundingBox.position.x,
                    roomBoundingBox.position.y + roomBoundingBox.height - height,
                    roomBoundingBox.width,
                    height
                );
                break;
            case 'left':
                boundingBox = new BoundingBox(
                    roomBoundingBox.position.x,
                    roomBoundingBox.position.y,
                    height,
                    roomBoundingBox.height
                );
                break;
            case 'right':
                boundingBox = new BoundingBox(
                    roomBoundingBox.position.x + roomBoundingBox.width - height,
                    roomBoundingBox.position.y,
                    height,
                    roomBoundingBox.height
                );
                break;
            default:
                throw new Error('Invalid mirror position');
        }

        super(p5, boundingBox, active);

        this.p5 = p5;
        this.boundingBox = boundingBox;
        this.isActive = active;
    }

    setup(): void {
        super.setup();
    }

    draw(): void {
        super.draw();
        this.p5.push();
        this.p5.fill(0, 0, 255, this.isActive ? 255 : 20);
        this.p5.stroke(!this.isActive ? 255 : 0, !this.isActive ? 255 : 0, this.isActive ? 255 : 0, this.isActive ? 255 : 127);
        this.p5.strokeWeight(.11);
        this.p5.rect(this.boundingBox.position.x, this.boundingBox.position.y, this.boundingBox.width, this.boundingBox.height);
        this.p5.pop();
    }
}