import GameObject from "./gameObject.js";
import Images from "./images.js";

export default class Virus extends GameObject {
    constructor(game, color) {
        super()
        this.game = game
        this.offset = game.offset
        this.color = color
        this.image = Images.getImage(`virus-${color}`)
        this.x = Math.floor(Math.random() * 8)
        this.y = Math.floor(Math.random() * 10 + 5)
        this.animationFrame = 1
        this.animationSpeed = 1000
    }

    draw(ctx) {
        let sx = 0
        switch (this.animationFrame) {
            case 1: {
                ctx.drawImage(this.image, 0, 0, 8, 8, this.x * 8 + this.offset.x, this.y * 8 + this.offset.y, 8, 8)
                break
            }
            case 2: {
                ctx.drawImage(this.image, 8, 0, 8, 8, this.x * 8 + this.offset.x, this.y * 8 + this.offset.y, 8, 8)
                break
            }
            case 4: {
                ctx.save()
                ctx.scale(-1, 1)
                ctx.drawImage(this.image, 8, 0, 8, 8, -(this.x * 8 + this.offset.x) - 8, this.y * 8 + this.offset.y, 8, 8)
                ctx.restore()
                break
            }
            case 5: {
                ctx.drawImage(this.image, 16, 0, 8, 8, this.x * 8 + this.offset.x, this.y * 8 + this.offset.y, 8, 8)
                break
            }
        }
    }

    update(timestamp) {
        if (this.animationFrame < 5) {
            if (timestamp % this.animationSpeed < this.animationSpeed / 4) {
                this.animationFrame = 1
            } else if (timestamp % this.animationSpeed < this.animationSpeed / 4 * 2) {
                this.animationFrame = 2
            } else if (timestamp % this.animationSpeed < this.animationSpeed / 4 * 3) {
                this.animationFrame = 1
            } else {
                this.animationFrame = 4
            }
        }
    }
}