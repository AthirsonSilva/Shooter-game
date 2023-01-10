import { CONTEXT } from '../script'

type EnemyProps = {
	x: number
	y: number
	radius: number
	color: string
	velocity: {
		x: number
		y: number
	}
}

export class Enemy {
	x: number
	y: number
	radius: number
	color: string
	velocity: {
		x: number
		y: number
	}

	constructor({ x, y, radius, color, velocity }: EnemyProps) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
	}

	draw() {
		CONTEXT.beginPath()
		CONTEXT.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		CONTEXT.fillStyle = this.color
		CONTEXT.fill()
	}

	update() {
		this.draw()
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
	}
}
