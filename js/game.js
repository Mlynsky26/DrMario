import Alert from "./alert.js"
import Board from "./board.js"
import GameObject from "./gameObject.js"
import Images from "./images.js"
import Keyboard from "./keyboard.js"
import Pill from "./pill.js"

export default class Game {
    constructor(height, width, ctx) {
        this.height = height
        this.width = width
        this.ctx = ctx
        this.offset = { x: 136, y: 48 }
        this.colors = [
            { red: 0, green: 80, blue: 0 },
            { red: 80, green: 0, blue: 0 },
            { red: 0, green: 0, blue: 80 },
        ]
        this.level = 1
        this.backgroundScale = 10
        this.pillId = 0
        this.gameObjects = []
        this.board = new Board(this)
        this.currentPill = new Pill(this)
        this.currentPill.current = true
        this.nextPill = new Pill(this)
        this.nextPill.x = 10
        this.nextPill.tiles[0].x = 14
        this.nextPill.tiles[1].x = 13
        this.nextPill.y = -2
        this.nextPill.tiles[0].y = -2
        this.nextPill.tiles[1].y = -2
        this.gameObjects.push(this.nextPill)
        this.backGroundImage = Images.getImage("background")
        this.pause = false
        this.points = 0
        Keyboard.init()
        Keyboard.addListener(key => {
            if (key == "Enter" && this.pause) {
                console.log("saasa")
            }
            if (!this.pause)
                this.currentPill.updateKey(key)
        })

    }

    addPoints() {
        this.points += 100
        console.log(this.points)
    }

    gameOver() {
        this.currentPill = new GameObject()
        this.nextPill = new GameObject()
        this.gameObjects.push(new Alert(this, 0))
        this.pause = true
    }
    stageCleared() {
        this.currentPill = new GameObject()
        this.nextPill = new GameObject()
        this.gameObjects.push(new Alert(this, 1))
        this.pause = true
    }

    drawBackground() {
        this.ctx.drawImage(this.backGroundImage, 0, 0)
    }
    draw(ctx) {
        this.gameObjects.forEach(object => object.draw(ctx));
        this.currentPill.draw(ctx)
    }

    update(timestamp) {
        Keyboard.update()
        this.currentPill.update(timestamp)
        this.board.update(timestamp)

        this.gameObjects.forEach(object => object.update(timestamp));
    }



}