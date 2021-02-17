import GameObject from "./gameObject.js"
import Images from "./images.js"
import Keyboard from "./keyboard.js"
import Tile from "./tile.js"

const colors = ["red", "yellow", "blue"]

export default class Pill extends GameObject {
    constructor(game) {
        super()
        this.game = game
        this.x = 3
        this.y = -1
        this.id = game.pillId++
        this.color1 = colors[Math.floor(Math.random() * 3)]
        this.color2 = colors[Math.floor(Math.random() * 3)]
        this.offset = game.offset
        this.tiles = [new Tile(this.color2, null, this.offset, this.id), new Tile(this.color1, null, this.offset, this.id)]
        this.directions = ["left", "bottom", "right", "up"]
        this.setDirection(this.directions[0])
        this.lastFall = 0
        this.speed = 1000
    }
    draw(ctx) {
        this.tiles[0].draw(ctx)
        this.tiles[1].draw(ctx)
    }
    setDirection(dir) {
        this.direction = dir
        switch (dir) {
            case "left": {
                this.tiles[0].type = "right"
                this.tiles[1].type = "left"
                this.tiles[0].x = this.x + 1
                this.tiles[1].x = this.x
                this.tiles[0].y = this.y
                this.tiles[1].y = this.y
                break
            }
            case "bottom": {
                this.tiles[0].type = "up"
                this.tiles[1].type = "bottom"
                this.tiles[0].x = this.x
                this.tiles[1].x = this.x
                this.tiles[0].y = this.y - 1
                this.tiles[1].y = this.y
                break
            }
            case "right": {
                this.tiles[0].type = "left"
                this.tiles[1].type = "right"
                this.tiles[0].x = this.x
                this.tiles[1].x = this.x + 1
                this.tiles[0].y = this.y
                this.tiles[1].y = this.y
                break
            }
            case "up": {
                this.tiles[0].type = "bottom"
                this.tiles[1].type = "up"
                this.tiles[0].x = this.x
                this.tiles[1].x = this.x
                this.tiles[0].y = this.y
                this.tiles[1].y = this.y - 1
                break
            }
        }
    }
    rotate(dir) {
        let canRotate = true
        if (this.isVertical()) {
            if (this.x == 7 || this.game.board.grid[this.x + 1][this.y] != 0) {
                if (this.game.board.grid[this.x - 1][this.y] == 0) {
                    canRotate = true
                    this.x--
                    this.tiles[0].x--
                    this.tiles[1].x--
                    canRotate = true
                } else {
                    this.canRotate = false
                }
            }
        }

        if (!this.isVertical() && this.y < 1) {
            if (this.game.board.grid[this.x][this.y - 1] != 0)
                canRotate = false
        }

        let index = this.directions.findIndex(element => element == this.direction)
        if (canRotate) {
            index = index + dir
            if (index < 0)
                index = 3
            else if (index > 3)
                index = 0
        }
        this.setDirection(this.directions[index])
    }
    moveLeft() {
        let shouldMove = true

        if (this.x - 1 < 0) return


        if (this.isVertical()) {
            if (this.game.board.grid[this.x - 1][this.y - 1] != 0) {
                shouldMove = false
            }
        }

        if (this.game.board.grid[this.x - 1][this.y] != 0) {
            shouldMove = false
        }

        if (shouldMove) {
            this.x--
            this.tiles[0].x--
            this.tiles[1].x--
        }
    }
    moveRight() {
        let shouldMove = true

        if (this.x + 1 > 7) return

        if (this.isVertical()) {
            if (this.game.board.grid[this.x + 1][this.y - 1] != 0) {
                shouldMove = false
            }
        }

        if (!this.isVertical()) {
            if (this.x + 2 > 7 || this.game.board.grid[this.x + 2][this.y] != 0) {
                shouldMove = false
            }
        }


        if (shouldMove) {
            this.x++
            this.tiles[0].x++
            this.tiles[1].x++
        }

    }
    canMoveDown() {
        if (this.y + 1 > 15) return false
        if (this.isVertical()) {
            if (this.game.board.grid[this.x][this.y + 1] == 0)
                return true
        }
        if (!this.isVertical()) {
            if (this.game.board.grid[this.x][this.y + 1] == 0 && this.game.board.grid[this.x + 1][this.y + 1] == 0)
                return true
        }
        return false
    }

    setOnBoard() {
        console.log("setOnBoard")
        this.game.gameObjects.push(this.tiles[0])
        this.game.gameObjects.push(this.tiles[1])

        if (this.direction == "up") {

            this.game.board.grid[this.x][this.y] = this.tiles[0]
            this.game.board.grid[this.x][this.y - 1] = this.tiles[1]

        } else if (this.direction == "bottom") {

            this.game.board.grid[this.x][this.y] = this.tiles[1]
            this.game.board.grid[this.x][this.y - 1] = this.tiles[0]

        } else if (this.direction == "left") {

            this.game.board.grid[this.x][this.y] = this.tiles[1]
            this.game.board.grid[this.x + 1][this.y] = this.tiles[0]

        } else if (this.direction == "right") {

            this.game.board.grid[this.x][this.y] = this.tiles[0]
            this.game.board.grid[this.x + 1][this.y] = this.tiles[1]

        }

        this.game.canAddPill = true

    }

    moveDown(timestamp) {
        if (!this.canMoveDown() && !this.game.canAddPill) {
            this.setOnBoard()
        }
        if (this.canMoveDown()) {
            //this.lastFall = timestamp
            this.y++
            this.tiles[0].y++
            this.tiles[1].y++

        }
    }

    isVertical() {
        if (this.direction == "left" || this.direction == "right")
            return false
        return true
    }

    updateKey(key) {
        if (!this.movesBlock) {

            if (key == "ArrowUp" || key == "w") {
                this.rotate(1)
            }
            if (key == "ArrowDown" || key == "s") {
                this.movesBlock = true
                this.speed = 20
            }
            if (key == "Shift") {
                this.rotate(-1)
            }
            if (key == "ArrowLeft" || key == "a") {
                this.moveLeft()
            }
            if (key == "ArrowRight" || key == "d") {
                this.moveRight()
            }
        }
    }

    update(timestamp) {
        if (this.current && timestamp - this.lastFall > this.speed) {
            this.moveDown()
            this.lastFall = timestamp
        }
    }
}