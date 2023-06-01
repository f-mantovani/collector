import { ExtractTypes } from './types/types.js'

export type BaseInfo = ExtractTypes<Base>
type BaseTyping = Pick<BaseInfo, 'x' | 'y' | 'width' | 'height' | 'speed' | 'type'>
type MoveDirection = 'up' | 'down' | 'right' | 'left'

export class Base {
  x: number
  y: number
  width: number
  height: number
  domElement: HTMLDivElement
  type: string
  keepOnScreen: boolean
  speed: number
  color: 'Red' | 'Green' | 'Purple'

  constructor ({ x, y, width, height, speed, type }: BaseTyping) {
    this.width = width
    this.height = height
    this.x = x - this.width / 2
    this.y = y
    this.type = type
    this.keepOnScreen = true
    this.speed = speed
    const randomColor = Math.round(Math.random() * 3) + 1
    this.color = randomColor === 1 ? 'Red' : randomColor === 2 ? 'Green' : 'Purple'
    this.domElement = this.createDomElement()
  }
  
  createDomElement (): HTMLDivElement {
    const domElement = document.createElement('div')
    domElement.classList.add(this.type)
    
    domElement.style.bottom = this.y + 'vh'
    domElement.style.left = this.x + 'vw'
    domElement.style.height = this.height + 'vh'
    domElement.style.width = this.width + 'vw'
    domElement.style.backgroundColor = this.color

    const parentElement = document.getElementById('board')
    parentElement?.appendChild(domElement)
    return domElement
  }

  move (direction: MoveDirection): void {
    switch (direction) {
      case 'up':
        this.y += this.speed
        this.domElement.style.bottom = this.y + 'vh'
        break
      case 'down':
        this.y -= this.speed
        this.domElement.style.bottom = this.y + 'vh'
        break
      case 'left':
        this.x -= this.speed
        this.domElement.style.left = this.x + 'vw'
        break
      case 'right':
        this.x += this.speed
        this.domElement.style.left = this.x + 'vw'
        break
      default:
        console.log('something went wrong we shouldn\'t be here')
    }
  }

  remove () {
    this.keepOnScreen = false
    this.domElement.remove()
  }
}
