import SceneObject from "./interfaces/SceneObject";
import BoundingBox from "./interfaces/BoundingBox";
import p5 from "p5";
import Mirror from "./Mirror";
import ObservableObject from "./ObservableObject";
import Eyeball from "./Eyeball";
import ReflectionPoint from "./ReflectionPoint";
import {RayLine} from "./Ray";

interface Reflection {
    start: p5.Vector;
    end: p5.Vector;
}

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
    numberOfReflections: number;
    showReflection: boolean = false;
    reflectionData: Reflection | null = null;

    constructor(p5: p5, x: number, y: number, size: number, isVirtual: boolean = false, numberOfReflections: number = 1) {
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
        this.numberOfReflections = numberOfReflections;
    }

    setup(): void {
        this.mirrors.forEach(mirror => mirror.setup());
        this.observableObject.setup();
        this.eyeball.setup();

        window.addEventListener('reflection-hover', this.onReflectionHover.bind(this) as EventListener);
        window.addEventListener('ray-cast', this.onRayCast.bind(this) as EventListener);
        window.addEventListener('ray-finished', this.onRayFinished.bind(this) as EventListener);
    }

    onRayFinished(event: CustomEvent) {
        if(this.isVirtual) return;

        const rayLines = event.detail.rayLines as RayLine[];
        const targetFound = event.detail.targetFound as boolean;

        if(!targetFound) return;

        this.calculateReflection(rayLines);
    }

    calculateReflection(rayLines: RayLine[]) {
        const sightLine = rayLines[rayLines.length - 1];
        const sightDirection = sightLine.direction.copy().mult(-1);
        const sightEndpoint = sightLine.getEndpoint(sightLine.maxT);

        let sightLength = 0;
        for(let i = 0; i < rayLines.length; i++) {
            const rayLine = rayLines[i];
            sightLength += rayLine.getEndpoint(rayLine.maxT).dist(rayLine.origin);
        }

        const reflectionOrigin = sightEndpoint.copy().add(sightDirection.copy().mult(sightLength));

        this.showReflection = true;
        this.reflectionData = {
            start: sightEndpoint,
            end: reflectionOrigin
        };
    }

    onRayCast(event: CustomEvent) {
        if(this.isVirtual) return;

        this.showReflection = false;
        const reflectionPoint = event.detail as ReflectionPoint;
        this.observableObject.castRay(reflectionPoint, this.mirrors, this.numberOfReflections, this.eyeball);
    }

    onReflectionHover(event: CustomEvent) {
        if(this.isVirtual) return;

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

        if(this.showReflection && this.reflectionData){
            this.p5.push();
            this.p5.stroke(255, 0, 0);
            this.p5.strokeWeight(2);
            this.p5.line(this.reflectionData.start.x, this.reflectionData.start.y, this.reflectionData.end.x, this.reflectionData.end.y);
            this.p5.pop();

            this.p5.push();
            this.p5.stroke(0);
            this.p5.fill(255, 0, 0, 127);
            this.p5.triangle(
                this.reflectionData.end.x,
                this.reflectionData.end.y,
                this.reflectionData.end.x + this.observableObject.boundingBox.width,
                this.reflectionData.end.y,
                this.reflectionData.end.x + this.observableObject.boundingBox.width / 2,
                this.reflectionData.end.y + this.observableObject.boundingBox.height
            );
            this.p5.pop();
        }
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