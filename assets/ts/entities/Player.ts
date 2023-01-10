import { CONTEXT } from '../script'

type PlayerProps = {
	x: number
	y: number
	radius: number
	color: string
}

export class Player {
	x: number
	y: number
	radius: number
	color: string

	constructor({ x, y, radius, color }: PlayerProps) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
	}

	draw() {
		CONTEXT.beginPath()
		CONTEXT.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		CONTEXT.fillStyle = this.color
		CONTEXT.fill()
	}
}
