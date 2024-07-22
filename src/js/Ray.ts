import BoundingBox from "./interfaces/BoundingBox";
import SceneObject from "./interfaces/SceneObject";
import p5 from "p5";
import Mirror from "./Mirror";
import Eyeball from "./Eyeball";

export class RayLine {
    origin: p5.Vector;
    direction: p5.Vector;
    maxT: number = 1000000;
    currentT: number = 0;

    constructor(origin: p5.Vector, direction: p5.Vector, t: number = 0) {
        this.origin = origin;
        this.direction = direction;
        this.currentT = t;
    }

    get t(): number {
        return this.currentT;
    }

    set t(t: number) {
        this.currentT = this.maxT > 0 ? Math.min(t, this.maxT) : t;
    }

    getEndpoint(t: number | null = null): p5.Vector {
        return this.origin.copy().add(this.direction.copy().mult(t ?? this.t));
    }

    setMaxT(maxT: number): void {
        this.maxT = maxT;
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
    isActivated: boolean = false;
    sequenceIndex: number = 0;
    isFinished: boolean = false;
    eyeball: Eyeball;
    targetFound: boolean = false;

    constructor(p5: p5, origin: p5.Vector, direction: p5.Vector, mirrors: Mirror[] = [], numberOfReflections: number = 5, eyeball: Eyeball) {
        this.p5 = p5;
        this.boundingBox = new BoundingBox(origin.x, origin.y, direction.x, direction.y);
        this.origin = origin;
        this.direction = direction;
        this.mirrors = mirrors;
        this.numberOfReflections = numberOfReflections;
        this.eyeball = eyeball;

        this.rayLines = [
            new RayLine(origin, direction)
        ];

        this.precomputeRayLines();
    }

    precomputeRayLines(): void {
        let currentRayLine = this.rayLines[0];

        for (let i = 0; i < this.numberOfReflections; i++) {
            const nextReflection = this.getNextRayline(currentRayLine);
            if (nextReflection === null) {
                break;
            }
            this.rayLines.push(nextReflection);
            currentRayLine = nextReflection;
        }
    }

    /**
     * Trace a ray and return the endpoint and the mirror it intersects with
     * @param rayLine
     */
    getReflectionEndpointAndMirror(rayLine: RayLine): { maxT: number, mirror: Mirror } | null {
        let intersectedMirror = null;
        for(const mirror of this.mirrors) {
            for(let i = 0; i < 100000; i++) {
                rayLine.t = i;
                const endpoint = rayLine.getEndpoint();
                if(this.eyeball.boundingBox.contains({ x: endpoint.x, y: endpoint.y })) {
                    rayLine.setMaxT(i);
                    this.targetFound = true;
                    break;
                }
                if(i > 0 && mirror.boundingBox.contains({ x: endpoint.x, y: endpoint.y})) {
                    intersectedMirror = mirror;
                    rayLine.setMaxT(i);
                    break;
                }
            }
        }
        rayLine.t = 0;

        if(intersectedMirror === null) {
            return null;
        }

        return {
            maxT: rayLine.maxT,
            mirror: intersectedMirror
        };
    }

    /**
     * Get the next rayline after reflection.
     *
     * Note: This function is not optimized for performance, but I
     * need a simple way to get the next rayline for the demo given
     * the time constraints.
     * @param rayLine
     */
    getNextRayline(rayLine: RayLine): RayLine | null {
        const reflectionData = this.getReflectionEndpointAndMirror(rayLine);
        if(reflectionData === null) {
            return null;
        }

        const endpoint = rayLine.getEndpoint(reflectionData.maxT);
        const normal = reflectionData.mirror.normal;
        const reflection = rayLine.direction.copy().reflect(normal);
        const nextRayLine = new RayLine(endpoint, reflection);
        const nextReflection = this.getReflectionEndpointAndMirror(nextRayLine);
        if(nextReflection !== null) {
            nextRayLine.setMaxT(nextReflection.maxT);
        }

        return nextRayLine;
    }

    cast(): void {
        this.isActivated = true;
    }

    setup(): void {
        // ignore
    }


    draw(): void {
        if(!this.isActivated) return;

        this.p5.push();

        if(this.targetFound && this.isFinished) {
            this.p5.stroke(0, 255, 0);
        } else {
            this.p5.stroke(255, 0, 255);
        }

        this.p5.strokeWeight(2);

        for(let i = 0; i <= this.sequenceIndex; i++) {
            const rayLine = this.rayLines[i];
            if(!rayLine) {
                continue;
            }

            this.p5.line(rayLine.origin.x, rayLine.origin.y, rayLine.getEndpoint().x, rayLine.getEndpoint().y);
        }

        if(!this.isFinished) {
            const currentRayLine = this.rayLines[this.sequenceIndex];
            if(currentRayLine.t >= currentRayLine.maxT) {
                this.sequenceIndex = this.sequenceIndex < this.rayLines.length ? this.sequenceIndex + 1 : this.sequenceIndex;
                if(this.sequenceIndex < this.rayLines.length) {
                    this.rayLines[this.sequenceIndex].t = 0;

                    // dispatching this event to notify the scene to draw
                    // a virtual room on the other side of the mirror
                    window.dispatchEvent(new CustomEvent('ray-reflection', {
                        detail: {
                            endpoint: this.rayLines[this.sequenceIndex].getEndpoint(),
                            mirror: this.getReflectionEndpointAndMirror(this.rayLines[this.sequenceIndex])?.mirror
                        }
                    }))
                } else {
                    this.isFinished = true;
                    window.dispatchEvent(new CustomEvent('ray-finished', {
                        detail: {
                            rayLines: this.rayLines,
                            targetFound: this.targetFound
                        }
                    }));
                }
            }

            if(this.sequenceIndex < this.rayLines.length) {
                this.rayLines[this.sequenceIndex].t += 25;
            }
        }

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