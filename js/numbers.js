import GameObject from "./gameObject.js";
import Images from "./images.js";

export default class Numbers extends GameObject {
    constructor(precision, number, position) {
        super()
        this.precision = precision
        this.number = number
        this.x = position.x * 8
        this.y = position.y * 8
        this.setPrecision()
    }
    setPrecision() {
        let text = this.number.toString()
        while (text.length < this.precision) {
            text = "0" + text
        }
        this.text = text
    }
    draw(ctx) {
        for (let i = 0; i < this.text.length; i++) {
            let image = Images.getImage(`numbers/${this.text[i]}`)
            ctx.drawImage(image, this.x + 8 * i, this.y, 8, 8)
        }
    }
}