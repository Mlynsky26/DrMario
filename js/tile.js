import GameObject from "./gameObject.js"
import Images from "./images.js"

export default class Tile extends GameObject {
    constructor(color, type, offset, id, x = 0, y = 0) {
        super()
        this.color = color
        this.type = type
        this.x = x
        this.y = y
        this.offset = offset
        this.id = id
        this.image = Images.getImage(`pill-${this.color}`)
        this.single = false
    }
    draw(ctx) {
        let sx = 0
        let sy = 0
        switch (this.type) {
            case "left": {
                sx = 8
                break
            }
            case "bottom": {
                sy = 8
                break
            }
            case "right": {
                sx = 16
                break
            }
            case "single": {
                sx = 8
                sy = 8
                break
            }
            case "deleted": {
                sx = 16
                sy = 8
                break
            }
        }
        ctx.drawImage(this.image, sx, sy, 8, 8, this.x * 8 + this.offset.x, this.y * 8 + this.offset.y, 8, 8)
    }
}