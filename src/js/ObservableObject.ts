import Draggable from "./base/Draggable";
import BoundingBox from "./interfaces/BoundingBox";
import p5 from "p5";
import ReflectionPoint from "./ReflectionPoint";
import Ray from "./Ray";
import Mirror from "./Mirror";
import Eyeball from "./Eyeball";

export default class ObservableObject extends Draggable {
    isReflection: boolean;
    hasCastRay: boolean = false;
    ray: Ray | null

    constructor(p5: p5, roomBoundingBox: BoundingBox, isReflection: boolean) {
        const boundingBox = new BoundingBox(
            roomBoundingBox.center.x,
            roomBoundingBox.center.y,
            roomBoundingBox.width * 0.03,
            roomBoundingBox.height * 0.03
        );

        super(p5, boundingBox.position.x, boundingBox.position.y, boundingBox.width, boundingBox.height);
        this.isReflection = isReflection;
        this.ray = null;
    }

    castRay(reflectionPoint: ReflectionPoint, mirrors: Mirror[], numberOfReflections: number, eyeball: Eyeball) {
        const origin = new p5.Vector(this.boundingBox.center.x, this.boundingBox.center.y);
        const destination = new p5.Vector(reflectionPoint.boundingBox.position.x, reflectionPoint.boundingBox.position.y);
        const direction = p5.Vector.sub(destination, origin).normalize();

        this.ray = new Ray(this.p5, origin, direction, mirrors, numberOfReflections, eyeball);
        this.ray.cast();
        this.hasCastRay = true;
    }

    drawSightLine(reflectionPoint: ReflectionPoint) {
        if(this.hasCastRay) return;

        this.p5.push();
        this.p5.stroke(0, 10, 200);
        this.p5.strokeWeight(1);
        this.p5.line(this.boundingBox.center.x, this.boundingBox.center.y, reflectionPoint.boundingBox.position.x, reflectionPoint.boundingBox.position.y);
        this.p5.pop();
    }

    draw() {
        super.draw();

        if(!this.isReflection) {
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

        if(this.ray){
            this.ray.draw();
        }
    }

}