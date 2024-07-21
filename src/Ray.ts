import BoundingBox from "./js/interfaces/BoundingBox";
import SceneObject from "./js/interfaces/SceneObject";
import p5 from "p5";
import Mirror from "./js/Mirror";

class RayLine {
    origin: p5.Vector;
    direction: p5.Vector;
    t: number;

    constructor(origin: p5.Vector, direction: p5.Vector, t: number = 0) {
        this.origin = origin;
        this.direction = direction;
        this.t = t;
    }

    getEndpoint(): p5.Vector {
        return this.origin.copy().add(this.direction.copy().mult(this.t));
    }
}

export default class Ray implements SceneObject {
    p5: p5;
    boundingBox: BoundingBox;
    origin: p5.Vector;
    direction: p5.Vector;
    mirrors: Mirror[];
    numberOfReflections: number;
    rayLines: RayLine[] = [];

    constructor(p5: p5, origin: p5.Vector, direction: p5.Vector, mirrors: Mirror[] = [], numberOfReflections: number = 1) {
        this.p5 = p5;
        this.boundingBox = new BoundingBox(origin.x, origin.y, direction.x, direction.y);
        this.origin = origin;
        this.direction = direction;
        this.mirrors = mirrors;
        this.numberOfReflections = numberOfReflections;

        this.rayLines = [
            new RayLine(origin, direction)
        ];

        this.precomputeRayLines();
        console.log(this.rayLines);
    }

    precomputeRayLines(): void {
        let currentRayLine = this.rayLines[0];

        for (let i = 0; i < this.numberOfReflections; i++) {
            const nextReflection = this.getNextReflection(currentRayLine);
            if (nextReflection === null) {
                break;
            }
            this.rayLines.push(nextReflection);
            currentRayLine = nextReflection;
        }
    }

    getNextReflection(rayLine: RayLine): RayLine | null {
        let intersectedMirror = null;
        let t = 0;
        for(const mirror of this.mirrors) {
            for(let i = 0; i < 100; i += 0.01) {
                rayLine.t = i;
                const endpoint = rayLine.getEndpoint();
                if(mirror.boundingBox.contains(endpoint)) {
                    window.dispatchEvent(new CustomEvent('reflection-strike', { detail: mirror }));
                    intersectedMirror = mirror;
                    break;
                }
            }
        }

        if(intersectedMirror === null) {
            rayLine.t = 0;
            return null;
        }

        const endpoint = rayLine.getEndpoint();
        rayLine.t = 0;
        const normal = intersectedMirror.normal;
        const reflection = rayLine.direction.copy().reflect(normal);
        return new RayLine(rayLine.getEndpoint(), reflection);
    }

    setup(): void {
        // ignore
    }

    draw(): void {
        this.p5.push();
        this.p5.stroke(0, 255, 0);
        this.p5.strokeWeight(2);

        const endpoint = this.origin.copy().add(this.direction);
        this.p5.line(this.boundingBox.position.x, this.boundingBox.position.y, this.boundingBox.width, this.boundingBox.height);
        this.p5.pop();
    }
    onClick(): void {
        // ignore
    }
    onMousePressed(): void {
        // ignore
    }
    onMouseReleased(): void {
        // ignore
    }

}