import { Base } from './base.js'
import { ExtractTypes } from './types/types.js'

export type ObstacleInfo = ExtractTypes<Obstacle>
export class Obstacle extends Base {
	color: 'Red' | 'Green'
	constructor() {
		const width = 5
		const x: number = Math.round(Math.random() * (100 - width) + 1)
		super({ x, y: 95, width, height: 5, type: 'obstacle', speed: 1.5 })
		this.color = Math.random() > 0.5 ? 'Red' : 'Green'
    this.domElement.style.backgroundColor = this.color
	}


}
