import GameObject from "./gameObject.js";
import Images from "./images.js";

export default class Alert extends GameObject {
    constructor(game, type) {
        super()
        this.game = game
        this.type = type
        this.height = 60
        this.setVariables()

    }
    setVariables() {
        switch (this.type) {
            case 0: {
                this.image = Images.getImage("go")
                this.width = 167
                this.x = Math.floor(this.game.width / 2 - this.width / 2)
                this.y = Math.floor(this.game.height / 2 - this.height / 2)
                break
            }
            case 1: {
                this.image = Images.getImage("sc")
                this.width = 212
                this.x = Math.floor(this.game.width / 2 - this.width / 2)
                this.y = Math.floor(this.game.height / 2 - this.height / 2)
                break
            }
        }
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}