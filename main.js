import { Player } from './src/player.js'
import { Obstacle } from './src/obstacle.js'
class Game {
  constructor () {
    this.player = null
    this.obstacles = []
    this.bullets = []
    this.time = 0
    this.score = 0
    this.isPaused = false
    this.intervalId = null
    this.attachListeners()
  }

  start () {
    this.player = new Player()
    this.startInterval()
  }

  startInterval () {
    this.intervalId = setInterval(() => {
      this.time += 1
      this.player.movePlayer()
      this.obstacleController()
    }, 20)
  }

  pauseGame () {
    if (this.isPaused) {
      this.startInterval()
      this.isPaused = !this.isPaused
    } else {
      clearInterval(this.intervalId)
      this.isPaused = !this.isPaused
    }
  }

  collisionDetection (firstInstance, secondInstance) {
    const firstObject = firstInstance.domElement.getBoundingClientRect()
    const secondObject = secondInstance.domElement.getBoundingClientRect()
    if (firstObject.x < secondObject.x + secondObject.width &&
            firstObject.x + firstObject.width > secondObject.x &&
            firstObject.y < secondObject.y + secondObject.height &&
            firstObject.height + firstObject.y > secondObject.y) {
      return true
    } else {
      return false
    }
  }

  obstacleController () {
    if (this.time % 100 === 0) {
      this.obstacles.push(new Obstacle())
    }
    this.obstacles = this.obstacles.filter(obstacle => obstacle.keepOnScreen === true)
    this.obstacles.forEach((obstacle) => {
      obstacle.move('down')
      const isOutside = Boolean(obstacle.y < 0 - obstacle.height)
      if (isOutside) {
        obstacle.remove()
      }
      const hasColided = this.collisionDetection(obstacle, this.player)
      if (hasColided) {
        obstacle.remove()
      }
    })
  }

  restart () {
    let _a
    clearInterval(this.intervalId);
    (_a = this.player) === null || _a === void 0 ? void 0 : _a.domElement.remove()
    this.obstacles.forEach(obstacle => obstacle.domElement.remove())
    this.player = null
    this.obstacles = []
    this.bullets = []
    this.time = 0
    this.score = 0
    this.intervalId = null
    this.start()
  }

  attachListeners () {
    document.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'KeyX':
          this.pauseGame()
          break
        case 'KeyN':
          this.restart()
          break
      }
    })
    const keydownListener = (event) => {
      switch (event.code) {
        case 'ArrowUp':
          this.player.keysPressed.up = true
          break
        case 'ArrowDown':
          this.player.keysPressed.down = true
          break
        case 'ArrowRight':
          this.player.keysPressed.right = true
          break
        case 'ArrowLeft':
          this.player.keysPressed.left = true
          break
        case 'Space':
          console.log('space')
          break
      }
    }
    const keyupListener = (event) => {
      switch (event.code) {
        case 'ArrowUp':
          this.player.keysPressed.up = false
          break
        case 'ArrowDown':
          this.player.keysPressed.down = false
          break
        case 'ArrowRight':
          this.player.keysPressed.right = false
          break
        case 'ArrowLeft':
          this.player.keysPressed.left = false
          break
      }
    }
    document.addEventListener('keydown', keydownListener)
    document.addEventListener('keyup', keyupListener)
  }
}
const game = new Game()
game.start()
