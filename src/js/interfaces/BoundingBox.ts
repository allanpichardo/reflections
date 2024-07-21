import Point from "../interfaces/Point";

export default class BoundingBox {
    position: Point;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.position = {x, y};
        this.width = width;
        this.height = height;
    }

    get center(): Point {
        return {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        };
    }

    intersects(other: BoundingBox): boolean {
        return this.position.x < other.position.x + other.width &&
               this.position.x + this.width > other.position.x &&
               this.position.y < other.position.y + other.height &&
               this.position.y + this.height > other.position.y;
    }

    contains(point: Point): boolean {
        return point.x >= this.position.x &&
               point.x <= this.position.x + this.width &&
               point.y >= this.position.y &&
               point.y <= this.position.y + this.height
    }
}