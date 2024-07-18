import BoundingBox from "./BoundingBox";
import p5 from "p5";

export default interface SceneObject {
    p5: p5;
    boundingBox: BoundingBox;
    setup(): void;
    draw(): void;
}