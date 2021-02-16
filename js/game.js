import Alert from "./alert.js"
import Board from "./board.js"
import DancingVirus from "./dancingVirus.js"
import GameObject from "./gameObject.js"
import Images from "./images.js"
import Keyboard from "./keyboard.js"
import Numbers from "./numbers.js"
import Pill from "./pill.js"

export default class Game {
    constructor(height, width, ctx) {
        window.game = this
        this.height = height
        this.width = width
        this.ctx = ctx
        this.offset = { x: 136, y: 48 }
        this.colors = [
            { red: 0, green: 80, blue: 0 },
            { red: 80, green: 0, blue: 0 },
            { red: 0, green: 0, blue: 80 },
        ]
        this.backgroundScale = 10
        this.pillId = 0
        this.backGroundImage = Images.getImage("background")
        this.reset(new Numbers(2, 0, { x: 35, y: 15 }), new Numbers(7, 0, { x: 5, y: 8 }))
        Keyboard.init()
        Keyboard.addListener(key => {
            if (this.state == "gameover" && key == "Enter") {
                this.reset(new Numbers(2, 0, { x: 35, y: 15 }), new Numbers(7, 0, { x: 5, y: 8 }))
            } else if (this.state == "nextlevel" && key == "Enter") {
                this.level.number++
                this.level.setPrecision()
                this.reset(this.level, this.points)
            }
            if (this.state == "level")
                this.currentPill.updateKey(key)
        })

    }

    reset(level, points) {
        this.gameObjects = []
        this.level = level
        this.gameObjects.push(this.level)
        this.points = points
        this.gameObjects.push(this.points)
        this.board = new Board(this)
        this.currentPill = new Pill(this)
        this.currentPill.current = true
        this.nextPill = new Pill(this)
        this.nextPill.x = 10
        this.nextPill.tiles[0].x = 14
        this.nextPill.tiles[1].x = 13
        this.nextPill.y = -3
        this.nextPill.tiles[0].y = -3
        this.nextPill.tiles[1].y = -3
        this.gameObjects.push(this.nextPill)
        this.dancingViruses = []
        for (let i = 1; i < 4; i++) {
            let color
            switch (i) {
                case 1: {
                    color = "blue"
                    break
                }
                case 2: {
                    color = "red"
                    break
                }
                case 3: {
                    color = "yellow"
                    break
                }
            }
            this.dancingViruses[i - 1] = new DancingVirus(this, color, i)
            this.gameObjects.push(this.dancingViruses[i - 1])
            this.topScore = new Numbers(7, localStorage.getItem("topScore"), { x: 5, y: 5 })
            this.gameObjects.push(this.topScore)
        }
        this.state = "level"

        let score = localStorage.getItem("topScore")
        if (score <= 0) {
            score = 0
            localStorage.setItem("topScore", score)
        }
    }


    addPoints() {
        this.points.number += 100
        this.points.setPrecision()
    }

    gameOver() {
        this.currentPill = new GameObject()
        this.nextPill = new GameObject()
        this.gameObjects.push(new Alert(this, 0))
        this.state = "gameover"
        let top = localStorage.getItem("topScore")
        if (this.points.number > top) {
            localStorage.setItem("topScore", this.points.number)
            this.topScore.number = this.points.number
        }
    }
    stageCleared() {
        this.currentPill = new GameObject()
        this.nextPill = new GameObject()
        this.gameObjects.push(new Alert(this, 1))
        this.state = "nextlevel"
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