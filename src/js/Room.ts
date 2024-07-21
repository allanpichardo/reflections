import SceneObject from "./interfaces/SceneObject";
import BoundingBox from "./interfaces/BoundingBox";
import p5 from "p5";
import Mirror from "./Mirror";
import ObservableObject from "./ObservableObject";
import Eyeball from "./Eyeball";
import ReflectionPoint from "./ReflectionPoint";

export default class Room implements SceneObject {

    static get SIZE(): number {
        return 200;
    }

    p5: p5;
    boundingBox: BoundingBox;
    isVirtual: boolean;
    mirrors: Mirror[] = [];
    observableObject: ObservableObject;
    eyeball: Eyeball;

    constructor(p5: p5, x: number, y: number, size: number, isVirtual: boolean = false) {
        this.p5 = p5;
        this.boundingBox = new BoundingBox(x - size / 2, y - size / 2, size, size);
        this.isVirtual = isVirtual;

        if(!isVirtual){
            this.mirrors = [
                new Mirror(p5, 'top', this.boundingBox, true, false),
                new Mirror(p5, 'bottom', this.boundingBox, true, false),
                new Mirror(p5, 'left', this.boundingBox, true, false),
                new Mirror(p5, 'right', this.boundingBox, true, false)
            ]
        }

        this.observableObject = new ObservableObject(p5, this.boundingBox, isVirtual);
        this.eyeball = new Eyeball(p5, this.boundingBox, isVirtual);
    }

    setup(): void {
        this.mirrors.forEach(mirror => mirror.setup());
        this.observableObject.setup();
        this.eyeball.setup();

        window.addEventListener('reflection-hover', this.onReflectionHover.bind(this) as EventListener);
        window.addEventListener('ray-cast', this.onRayCast.bind(this) as EventListener);
    }

    onRayCast(event: CustomEvent) {
        const reflectionPoint = event.detail as ReflectionPoint;
        this.observableObject.castRay(reflectionPoint);
    }

    onReflectionHover(event: CustomEvent) {
        const reflectionPoint = event.detail as ReflectionPoint;
        this.observableObject.drawSightLine(reflectionPoint);
    }

    draw(): void {
        this.p5.push();
        this.p5.stroke(this.isVirtual ? 200 : 0, this.isVirtual ? 127 : 255);
        this.p5.strokeWeight(1);
        this.p5.fill(this.isVirtual ? 250 : 255, this.isVirtual ? 127 : 255);
        this.p5.rect(this.boundingBox.position.x, this.boundingBox.position.y, this.boundingBox.width, this.boundingBox.height);
        this.p5.pop();

        this.mirrors.forEach(mirror => mirror.draw());
        this.observableObject.draw();
        this.eyeball.draw();
    }

    onClick() {
        this.mirrors.forEach(mirror => mirror.onClick());
        this.observableObject.onClick();
        this.eyeball.onClick();
    }

    onMousePressed() {
        this.mirrors.forEach(mirror => mirror.onMousePressed());
        this.observableObject.onMousePressed();
        this.eyeball.onMousePressed();
    }

    onMouseReleased() {
        this.mirrors.forEach(mirror => mirror.onMouseReleased());
        this.observableObject.onMouseReleased();
        this.eyeball.onMouseReleased();
    }
}