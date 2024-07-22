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

    p5: p5;
    boundingBox: BoundingBox;
    size: number;
    isVirtual: boolean;
    mirrors: Mirror[] = [];
    observableObject: ObservableObject;
    eyeball: Eyeball;
    numberOfReflections: number;
    showReflection: boolean = false;
    reflectionData: Reflection | null = null;
    reflectionPoints: Map<string, p5.Vector>

    constructor(p5: p5, x: number, y: number, size: number, isVirtual: boolean = false, numberOfReflections: number = 1) {
        this.p5 = p5;
        this.size = size;
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
        this.reflectionPoints = new Map();
    }

    setup(): void {
        this.mirrors.forEach(mirror => mirror.setup());
        this.observableObject.setup();
        this.eyeball.setup();

        window.addEventListener('reflection-hover', this.onReflectionHover.bind(this) as EventListener);
        window.addEventListener('ray-cast', this.onRayCast.bind(this) as EventListener);
        window.addEventListener('ray-finished', this.onRayFinished.bind(this) as EventListener);
        window.addEventListener('ray-bounce', this.onRayBounce.bind(this) as EventListener);
    }

    /**
     * This event is triggered when a ray bounces off a mirror.
     * It should recursively calculate the reflection points
     * however I ran out of time to implement this correctly.
     * @param event
     */
    onRayBounce(event: CustomEvent) {
        if(this.isVirtual || this.showReflection || this.reflectionData) return;

        const rayLine = event.detail.rayLine as RayLine;
        const mirror = event.detail.mirror as Mirror;

        for(const [loc, point] of this.reflectionPoints){
            const reflection = point.copy().reflect(mirror.normal);
            console.log(mirror.position, reflection);
            // adding reflections to the map to avoid duplicates
            this.reflectionPoints.set(
                `${reflection.x},${reflection.y}`,
                reflection
            );
        }
    }

    /**
     * This event is triggered when a ray finishes casting
     * and either hits the eyeball or exhausts all reflections.
     * @param event
     */
    onRayFinished(event: CustomEvent) {
        if(this.isVirtual || this.showReflection || this.reflectionData) return;

        const rayLines = event.detail.rayLines as RayLine[];
        const targetFound = event.detail.targetFound as boolean;

        if(!targetFound) return;

        this.calculateReflection(rayLines);
        this.showResetButton();
    }

    showResetButton() {
        const button = document.querySelector('#reset') as HTMLButtonElement;
        button.style.display = 'block';
    }

    /**
     * Calculates a sight line from the eyeball to the final
     * reflection image.
     * @param rayLines
     */
    calculateReflection(rayLines: RayLine[]) {
        const sightLine = rayLines[rayLines.length - 1];
        const sightDirection = sightLine.direction.copy().mult(-1);
        const sightEndpoint = sightLine.getEndpoint(sightLine.maxT);

        let sightLength = 0;
        for(let i = 0; i < rayLines.length; i++) {
            const rayLine = rayLines[i];
            sightLength += rayLine.maxT;
        }

        const reflectionOrigin = sightEndpoint.copy().add(sightDirection.copy().mult(sightLength));

        this.reflectionPoints.set(
            `${reflectionOrigin.x},${reflectionOrigin.y}`,
            reflectionOrigin
        )

        this.showReflection = true;
        this.reflectionData = {
            start: sightEndpoint,
            end: reflectionOrigin,
        };
    }

    /**
     * This event is triggered when a user clicks on a mirror
     * to cast a ray.
     * @param event
     */
    onRayCast(event: CustomEvent) {
        if(this.isVirtual || this.showReflection || this.reflectionData || this.observableObject.hasCastRay) return;

        // We start with the objects position as the first reflection point
        // and then on each bounce we reflect the object over the mirror
        // normal
        this.showReflection = false;
        this.reflectionData = null;
        this.reflectionPoints.clear();
        this.reflectionPoints.set(
            `${this.observableObject.boundingBox.center.x},${this.observableObject.boundingBox.center.y}`,
        new p5.Vector(this.observableObject.boundingBox.center.x, this.observableObject.boundingBox.center.y)
        );

        const reflectionPoint = event.detail as ReflectionPoint;
        this.observableObject.castRay(reflectionPoint, this.mirrors, this.numberOfReflections, this.eyeball);
    }

    onReflectionHover(event: CustomEvent) {
        if(this.isVirtual) return;

        const reflectionPoint = event.detail as ReflectionPoint;
        this.observableObject.drawSightLine(reflectionPoint);
    }

    drawTriangle(position: p5.Vector) {
        this.p5.push();
        this.p5.stroke(0);
        this.p5.fill(255, 0, 0, 127);
        this.p5.triangle(
            position.x,
            position.y,
            position.x + this.observableObject.boundingBox.width,
            position.y,
            position.x + this.observableObject.boundingBox.width / 2,
            position.y + this.observableObject.boundingBox.height
        );
        this.p5.pop();
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

            // Skipping the first object
            for(let i = 1; i < this.reflectionPoints.size; i++){
                const reflectionPoint = Array.from(this.reflectionPoints.values())[i];
                this.drawTriangle(reflectionPoint);
            }
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