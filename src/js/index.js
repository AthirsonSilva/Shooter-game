// Getting the necessary elements
const canvas = document.querySelector('canvas')
canvas.width = innerWidth
canvas.height = innerHeight
const context = canvas.getContext('2d')
const score = document.querySelector('#score')
const start = document.querySelector('#startBtn')
const modal = document.querySelector('#modal')
const bigScore = document.querySelector('#bigScore')

//! Player object
class Player {
	constructor(x, y, radius, color) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
	}
	// Draw
	draw() {
		context.beginPath()
		context.arc(this.x,
			this.y,
			this.radius,
			0,
			Math.PI * 2,
			false)
		context.fillStyle = this.color
		context.fill()
	}
}

//! Projectile creation
class Projectile {
	constructor(x, y, radius, color, velocity) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
	}


	draw() {
		context.beginPath()
		context.arc(this.x,
			this.y,
			this.radius,
			0,
			Math.PI * 2,
			false)
		context.fillStyle = this.color
		context.fill()
	}

	update() {
		this.draw()
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
	}
}

class Enemy {
	constructor(x, y, radius, color, velocity) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
	}


	draw() {
		context.beginPath()
		context.arc(
			this.x,
			this.y,
			this.radius,
			0,
			Math.PI * 2,
			false)
		context.fillStyle = this.color
		context.fill()
	}

	update() {
		this.draw()
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
	}
}

const friction = 0.98
class Particle {
	constructor(x, y, radius, color, velocity) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
		this.alpha = 1
	}


	draw() {
		context.save()
		context.globalAlpha = this.alpha
		context.beginPath()
		context.arc(
			this.x,
			this.y,
			this.radius,
			0,
			Math.PI * 2,
			false)
		context.fillStyle = this.color
		context.fill()
		context.restore()
	}

	update() {
		this.draw()
		this.velocity.x *= friction
		this.velocity.y *= friction
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
		this.alpha -= 0.01
	}
}



// Constants declaration
const x = canvas.width / 2
const y = canvas.height / 2

let player = new Player(x, y, 10, 'white')
let projectiles = new Array()
let enemies = new Array()
let particles = new Array()

function startGame() {
	player = new Player(x, y, 10, 'white')
	projectiles = new Array()
	enemies = new Array()
	particles = new Array()
	points = 0
	score.innerHTML = points
	bigScore.innerHTML = points
}

// Enemies
function spawnEnemies() {
	setInterval(() => {
		const radius = Math.random() * (30 - 10) + 10
		let x
		let y
		if (Math.random() < 0.5) {
			x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
			y = Math.random() * canvas.height
		} else {
			x = Math.random() * canvas.width
			y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
		}
		const color = `hsl(${Math.random() * 360}, 50%, 50%)`
		const angle = Math.atan2(
			canvas.height / 2 - y,
			canvas.width / 2 - x
		)

		const velocity = {
			x: Math.cos(angle) * 2,
			y: Math.sin(angle) * 2
		}

		enemies.push(new Enemy(x, y, radius, color, velocity))
	}, 1000)

}

// Animations
let animationID
let points = 0
function animate() {
	animationID = requestAnimationFrame(animate)
	context.fillStyle = 'rgba(0, 0, 0, 0.1)'
	context.fillRect(0, 0, canvas.width, canvas.height)
	player.draw()
	particles.forEach((particle, index) => {
		if (particle.alpha <= 0) {
			particles.splice(index, 1)
		} else {
			particle.update()
		}
	})
	/* context.clearRect(
			0,
			0,
			canvas.width,
			canvas.height) */
	player.draw()
	projectiles.forEach((projectile, pIndex) => {
		projectile.update()

		// Remove projectiles
		if (projectile.x + projectile.radius < 0 ||
			projectile.x - projectile.radius > canvas.width ||
			projectile.y + projectile.radius < 0 ||
			projectile.y - projectile.radius > canvas.height) {
			setTimeout(() => {
				projectiles.splice(pIndex, 1)
			}, 0)
		}
	})

	enemies.forEach((enemy, eIndex) => {
		enemy.update()

		const dist = Math.hypot(
			player.x - enemy.x,
			player.y - enemy.y
		)

		// Game over
		if (dist - enemy.radius - player.radius < 1) {
			cancelAnimationFrame(animationID)
			modal.style.display = 'flex'
			bigScore.innerHTML = points
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
				score.innerHTML = points

				// Explosion
				for (let i = 0; i < enemy.radius * 2; i++) {
					particles.push(new Particle(
						projectile.x,
						projectile.y,
						Math.random() * 2,
						enemy.color,
						{
							x: (Math.random() - 0.5) * (Math.random() * 8),
							y: (Math.random() - 0.5) * (Math.random() * 8)
						}
					))
				}
				// Shrinking enemies
				if (enemy.radius - 10 > 5) {
					points += 50
					score.innerHTML = points

					gsap.to(enemy, {
						radius: enemy.radius - 10
					})
					setTimeout(() => {
						projectiles.splice(pIndex, 1)
					}, 0)
				} else {
					points += 250
					score.innerHTML = points
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
		event.clientY - canvas.height / 2,
		event.clientX - canvas.width / 2
	)

	const velocity = {
		x: Math.cos(angle) * 6,
		y: Math.sin(angle) * 6
	}
	projectiles.push(new Projectile(
		canvas.width / 2,
		canvas.height / 2,
		5,
		'white',
		velocity))
})

start.addEventListener('click', () => {
	startGame()
	animate()
	spawnEnemies()
	modal.style.display = 'none'
})