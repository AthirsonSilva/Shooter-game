import { CONTEXT, FRICTION } from '../script'

type ParticleProps = {
	x: number
	y: number
	radius: number
	color: string
	velocity: {
		x: number
		y: number
	}
}

export class Particle {
	x: number
	y: number
	radius: number
	color: string
	velocity: {
		x: number
		y: number
	}
	alpha: number

	constructor({ x, y, radius, color, velocity }: ParticleProps) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
		this.alpha = 1
	}

	draw() {
		CONTEXT.save()
		CONTEXT.globalAlpha = this.alpha
		CONTEXT.beginPath()
		CONTEXT.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		CONTEXT.fillStyle = this.color
		CONTEXT.fill()
		CONTEXT.restore()
	}

	update() {
		this.draw()
		this.velocity.x *= FRICTION
		this.velocity.y *= FRICTION
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
		this.alpha -= 0.01
	}
}
