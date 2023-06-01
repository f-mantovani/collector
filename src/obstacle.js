import { Base } from './base.js';
export class Obstacle extends Base {
    constructor() {
        const width = 5;
        const x = Math.round(Math.random() * (100 - width) + 1);
        super({ x, y: 95, width, height: 5, type: 'obstacle', speed: 1.5 });
    }
}
