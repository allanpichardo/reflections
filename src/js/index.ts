import '../css/index.css';
import p5 from "p5";
import Scene from "./Scene";

function main(): void {
    new p5((p5: p5) => {
        const scene = new Scene(p5, 900, 900);
        p5.setup = scene.setup.bind(scene);
        p5.draw = scene.draw.bind(scene);
    });
}

main();