import { gsap } from 'gsap'
import { Enemy } from './entities/Enemy'
import { Particle } from './entities/Particle'
import { Player } from './entities/Player'
import { Projectile } from './entities/Projectile'

const CANVAS = document.querySelector('canvas') as HTMLCanvasElement
CANVAS.width = innerWidth
CANVAS.height = innerHeight

const SCORE = document.querySelector('#score') as HTMLSpanElement
const START = document.querySelector('#startBtn') as HTMLButtonElement
const MODAL = document.querySelector('#modal') as HTMLDivElement
const BIG_SCORE = document.querySelector('#bigScore') as HTMLSpanElement
const X = CANVAS.width / 2
const Y = CANVAS.height / 2

export const CONTEXT = CANVAS.getContext('2d') as CanvasRenderingContext2D
export const FRICTION = 0.98

let animationID: number
let points = 0

let player = new Player({ x: X, y: Y, radius: 10, color: 'white' })
let projectiles = new Array()
let enemies = new Array()
let particles = new Array()

const __init__ = () => {
	player = new Player({ x: X, y: Y, radius: 10, color: 'white' })
	projectiles = new Array()
	enemies = new Array()
	particles = new Array()
	points = 0
	SCORE.innerHTML = points.toString()
	BIG_SCORE.innerHTML = points.toString()
}

const spawnEnemies = () => {
	setInterval(() => {
		const radius = Math.random() * (30 - 10) + 10
		let x
		let y
		if (Math.random() < 0.5) {
			x = Math.random() < 0.5 ? 0 - radius : CANVAS.width + radius
			y = Math.random() * CANVAS.height
		} else {
			x = Math.random() * CANVAS.width
			y = Math.random() < 0.5 ? 0 - radius : CANVAS.height + radius
		}
		const color = `hsl(${Math.random() * 360}, 50%, 50%)`
		const angle = Math.atan2(CANVAS.height / 2 - y, CANVAS.width / 2 - x)

		const velocity = {
			x: Math.cos(angle) * 0.5,
			y: Math.sin(angle) * 0.5
		}

		enemies.push(new Enemy({ x, y, radius, color, velocity }))
	}, 1000)
}

const animate = () => {
	animationID = requestAnimationFrame(animate)
	CONTEXT.fillStyle = 'rgba(0, 0, 0, 0.1)'
	CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height)
	player.draw()
	particles.forEach((particle, index) => {
		if (particle.alpha <= 0) {
			particles.splice(index, 1)
		} else {
			particle.update()
		}
	})

	player.draw()
	projectiles.forEach((projectile, pIndex) => {
		projectile.update()

		if (
			projectile.x + projectile.radius < 0 ||
			projectile.x - projectile.radius > CANVAS.width ||
			projectile.y + projectile.radius < 0 ||
			projectile.y - projectile.radius > CANVAS.height
		) {
			setTimeout(() => {
				projectiles.splice(pIndex, 1)
			}, 0)
		}
	})

	enemies.forEach((enemy, eIndex) => {
		enemy.update()

		const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

		// Game over
		if (dist - enemy.radius - player.radius < 1) {
			cancelAnimationFrame(animationID)
			MODAL.style.display = 'flex'
			BIG_SCORE.innerHTML = points.toString()
		}

		projectiles.forEach((projectile, pIndex) => {
			const dist = Math.hypot(
				projectile.x - enemy.x,
				projectile.y - enemy.y
			)

			// Projectiles touching enemy
			if (dist - enemy.radius - projectile.radius < 1) {
				// Increase score
				points += 100
				SCORE.innerHTML = points.toString()

				// Explosion
				for (let i = 0; i < enemy.radius * 2; i++) {
					particles.push(
						new Particle({
							x: projectile.x as number,
							y: projectile.y as number,
							radius: Math.random() * 2,
							color: enemy.color as string,
							velocity: {
								x: (Math.random() - 0.5) * (Math.random() * 8),
								y: (Math.random() - 0.5) * (Math.random() * 8)
							}
						})
					)
				}
				// Shrinking enemies
				if (enemy.radius - 10 > 5) {
					points += 50
					SCORE.innerHTML = points.toString()

					gsap.to(enemy, {
						radius: enemy.radius - 10
					})
					setTimeout(() => {
						projectiles.splice(pIndex, 1)
					}, 0)
				} else {
					points += 250
					SCORE.innerHTML = points.toString()
					setTimeout(() => {
						enemies.splice(eIndex, 1)
						projectiles.splice(pIndex, 1)
					}, 0)
				}
			}
		})
	})
}

// Clicker
addEventListener('click', (event) => {
	const angle = Math.atan2(
		event.clientY - CANVAS.height / 2,
		event.clientX - CANVAS.width / 2
	)

	const velocity = {
		x: Math.cos(angle) * 6,
		y: Math.sin(angle) * 6
	}
	projectiles.push(
		new Projectile({
			x: CANVAS.width / 2,
			y: CANVAS.height / 2,
			radius: 5,
			color: 'white',
			velocity
		})
	)
})

START.addEventListener('click', () => {
	__init__()
	animate()
	spawnEnemies()
	MODAL.style.display = 'none'
})
