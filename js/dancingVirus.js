import GameObject from "./gameObject.js";
import Images from "./images.js";

export default class DancingVirus extends GameObject {
    constructor(game, color, number) {
        super()
        this.game = game
        this.offsetX = 64
        this.offsetY = 140
        this.color = color
        this.image = Images.getImage(`bloke-${color}`)
        this.angle = (Math.PI * 2 / 3) * number
        this.r = 24
        this.sin = Math.sin(this.angle)
        this.cos = Math.cos(this.angle)
        this.x = this.sin * this.r + this.offsetX
        this.y = this.cos * this.r + this.offsetY
        this.lastRotate = 0
        this.rotateSpeed = 1000
        this.animationSpeed = 1000
        this.animationFrame = 1
        this.deleteTime = 0
    }

    rotate() {
        this.angle += 0.5
        this.sin = Math.sin(this.angle)
        this.cos = Math.cos(this.angle)
        this.x = Math.round(this.sin * this.r + this.offsetX)
        this.y = Math.round(this.cos * this.r + this.offsetY)
    }

    update(timestamp) {
        if (this.game.state != "gameover" && timestamp - this.lastRotate > this.rotateSpeed) {
            this.rotate()
            this.lastRotate = timestamp
        }

        if (this.game.state == "level" && this.deleteTime == 0) {
            if (timestamp % this.animationSpeed < this.animationSpeed / 4) {
                this.animationFrame = 1
            } else if (timestamp % this.animationSpeed < this.animationSpeed / 4 * 2) {
                this.animationFrame = 2
            } else if (timestamp % this.animationSpeed < this.animationSpeed / 4 * 3) {
                this.animationFrame = 1
            } else {
                this.animationFrame = 4
            }
        } else if (this.game.state == "gameover") {
            if (timestamp % this.animationSpeed < this.animationSpeed / 2) {
                this.animationFrame = 1
            } else {
                this.animationFrame = 5
            }
        } else {
            if (new Date().getTime() - this.deleteTime > 1000) {
                this.game.gameObjects = this.game.gameObjects.filter(element => element != this)
            }
        }
    }
    draw(ctx) {
        switch (this.animationFrame) {
            case 1: {
                ctx.drawImage(this.image, 0, 0, 32, 24, this.x - 20, this.y - 8, 32, 24)
                break
            }
            case 2: {
                ctx.drawImage(this.image, 32, 0, 32, 24, this.x - 20, this.y - 8, 32, 24)
                break
            }
            case 4: {
                ctx.save()
                ctx.scale(-1, 1)
                ctx.drawImage(this.image, 32, 0, 32, 24, -this.x - 12, this.y - 8, 32, 24)
                //ctx.drawImage(this.image, 8, 0, 8, 8, -(this.x * 8 + this.offset.x) - 8, this.y * 8 + this.offset.y, 8, 8)
                ctx.restore()
                break
            }
            case 5: {
                ctx.drawImage(this.image, 0, 24, 32, 24, this.x - 20, this.y - 8, 32, 24)
                break
            }
            case 6: {
                ctx.drawImage(this.image, 32, 24, 32, 24, this.x - 20, this.y - 8, 32, 24)
                break
            }
        }
    }
}