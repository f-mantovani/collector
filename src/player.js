import { Base } from './base.js';
export class Player extends Base {
    constructor() {
        super({ x: 50, y: 0, width: 10, height: 5, type: 'player', speed: 1 });
        this.keysPressed = { up: false, down: false, left: false, right: false };
    }
    movePlayer() {
        if (this.keysPressed.up && this.y + this.height < 100)
            this.move('up');
        if (this.keysPressed.down && this.y > 0)
            this.move('down');
        if (this.keysPressed.right && this.x + this.width < 100)
            this.move('right');
        if (this.keysPressed.left && this.x > 0)
            this.move('left');
    }
}
