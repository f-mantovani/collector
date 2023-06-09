import { Player, PlayerInfo } from './src/player.js'
import { Obstacle, ObstacleInfo } from './src/obstacle.js'
import { BaseInfo } from './src/base.js'
import { ExtractTypes } from './src/types/types.js'

class Game {
	player: PlayerInfo | null
	obstacles: ObstacleInfo[]
	time: number
	score: number
	fps: number
	isPaused: boolean
	intervalId: ReturnType<typeof setInterval> | null

	constructor() {
		this.player = null
		this.obstacles = []
		this.time = 0
		this.score = 0
		this.isPaused = false
		this.intervalId = null
		this.fps = 35
		this.attachListeners()
	}

	start() {
		this.player = new Player()
		this.gameInterval()
	}

	gameInterval() {
		this.intervalId = setInterval(() => {
			this.time += 1
			this.player!.movePlayer()
			this.obstacleController()
			this.updateScore()
			if (this.score < 0) {
				this.gameOver()
			}
		}, 20)
	}

	pauseGame() {
		if (this.isPaused) {
			this.gameInterval()
			this.isPaused = !this.isPaused
		} else {
			clearInterval(this.intervalId!)
			this.isPaused = !this.isPaused
		}
	}

	restart() {
		clearInterval(this.intervalId!)
		this.player?.domElement.remove()
		this.obstacles.forEach(obstacle => obstacle.domElement.remove())
		this.player = null
		this.obstacles = []
		this.time = 0
		this.score = 0
		this.intervalId = null
		this.start()
	}

	gameOver() {
		const highScore = Number(localStorage.getItem('highScore')) || 0
		const highest = Math.max(highScore, this.score)
		localStorage.setItem('highScore', String(highest))

		clearInterval(this.intervalId!)
		restartParent!.style.display = 'flex'
		const scoring = document.getElementById('scoring')
		if (scoring) {
			scoring.style.display = 'flex'
			scoring.style.flexDirection = 'column'
			scoring.style.alignItems = 'center'
			scoring.innerHTML = `
			<p> Your highest score is: <p>
			<p> ${highest} <p>
			`
			restartParent?.insertBefore(scoring, restartBtn)
		}
	}

	updateScore() {
		const scoreElement = document.querySelector('#score')
		if (scoreElement) {
			scoreElement.innerHTML = `
				<div id="score">
				Score:
				<span>${this.score}</span>
			`
		}
	}

	attachListeners() {
		document.addEventListener('keydown', (event: KeyboardEvent) => {
			switch (event.code) {
				case 'KeyX':
					this.pauseGame()
					break
				case 'Space':
					this.player!.changeColor()
					break
			}
		})

		const keydownListener = (event: KeyboardEvent) => {
			switch (event.code) {
				case 'ArrowUp':
					this.player!.keysPressed.up = true
					break
				case 'ArrowDown':
					this.player!.keysPressed.down = true
					break
				case 'ArrowRight':
					this.player!.keysPressed.right = true
					break
				case 'ArrowLeft':
					this.player!.keysPressed.left = true
					break
			}
		}

		const keyupListener = (event: KeyboardEvent) => {
			switch (event.code) {
				case 'ArrowUp':
					this.player!.keysPressed.up = false
					break
				case 'ArrowDown':
					this.player!.keysPressed.down = false
					break
				case 'ArrowRight':
					this.player!.keysPressed.right = false
					break
				case 'ArrowLeft':
					this.player!.keysPressed.left = false
					break
			}
		}

		document.addEventListener('keydown', keydownListener)
		document.addEventListener('keyup', keyupListener)
	}

	collisionDetection(firstInstance: BaseInfo, secondInstance: BaseInfo) {
		const firstObject = firstInstance.domElement.getBoundingClientRect()
		const secondObject = secondInstance.domElement.getBoundingClientRect()
		if (
			firstObject.x < secondObject.x + secondObject.width &&
			firstObject.x + firstObject.width > secondObject.x &&
			firstObject.y < secondObject.y + secondObject.height &&
			firstObject.height + firstObject.y > secondObject.y
		) {
			return true
		} else {
			return false
		}
	}

	obstacleController() {
		if (this.time % 90 === 0) {
			this.obstacles.push(new Obstacle())
		}
		this.obstacles = this.obstacles.filter(obstacle => obstacle.keepOnScreen)
		this.obstacles.forEach((obstacle: ObstacleInfo) => {
			obstacle.move('down')
			const isOutside = Boolean(obstacle.y < 0 - obstacle.height)
			if (isOutside) {
				obstacle.remove()
				this.score -= 5
			}
			const hasColided = this.collisionDetection(obstacle, this.player!)
			if (hasColided) {
				obstacle.remove()
				if (this.player!.color === obstacle.color) {
					this.score += 10
				} else {
					this.gameOver()
				}
			}
		})
	}
}

const game: ExtractTypes<Game> = new Game()

const startBtn = document.querySelector('.start')
startBtn?.addEventListener('click', () => {
	game.start()
	const instructions = startBtn.parentElement
	instructions!.style.display = 'none'
})

const restartBtn = document.querySelector('.restart button')
const restartParent = restartBtn!.parentElement
restartBtn?.addEventListener('click', () => {
	game.restart()
	restartParent!.style.display = 'none'
})
