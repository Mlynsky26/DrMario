import Virus from "./virus.js"
import Tile from "./tile.js"
import Numbers from "./numbers.js"
import DancingVirus from "./dancingVirus.js"
import Pill from "./pill.js"


export default class Board {
    constructor(game) {
        this.game = game
        this.width = 8
        this.height = 16
        this.grid = this.createEmptyGrid()
        this.colors = ["blue", "red", "yellow"]
        this.virusesCount = [0, 0, 0]
        this.viruses = this.generateViruses(this.game.level.number)
        this.lastFall = 0
        this.canClear = false
        this.speed = 20
        this.toDelete = []
        this.virusNumber = new Numbers(2, this.viruses.length, { x: 35, y: 21 })
        this.game.gameObjects.push(this.virusNumber)

    }

    createEmptyGrid() {
        let currGrid = []
        for (let x = 0; x < this.width; x++) {
            let row = []
            for (let y = 0; y < this.height; y++) {
                row.push(0)
            }
            currGrid.push(row)

        }
        return currGrid
    }

    generateViruses(level) {
        let viruses = []
        for (let i = 0; i < 4 * (level + 1); i++) {
            let virus = new Virus(this.game, this.colors[i % 3])
            if (this.grid[virus.x][virus.y] != 0) {
                i--
                continue
            }

            switch (virus.color) {
                case "blue": {
                    this.virusesCount[0]++
                    break
                }
                case "red": {
                    this.virusesCount[1]++
                    break
                }
                case "yellow": {
                    this.virusesCount[2]++
                    break
                }
            }

            viruses.push(virus)
            this.game.gameObjects.push(virus)
            this.grid[virus.x][virus.y] = virus
        }
        return viruses
    }

    update(timestamp) {
        if (timestamp - this.lastFall > this.speed) {

            if (this.game.canAddPill) {
                if (this.game.board.grid[3][0] != 0 || this.game.board.grid[4][0] != 0) {
                    this.game.gameOver()
                }
            }
            this.speed = 20
            this.deleteFours()
            this.fallDown()
            this.lastFall = timestamp
        }
        if (!this.canClear) {
            this.clearFours()
            this.canClear = true
        }
    }

    findPair(tile1) {
        let index
        for (let i = 0; i < this.grid.length; i++) {
            index = this.grid[i].findIndex(e => e.id == tile1.id && tile1 != e)
            if (index != -1) {
                index = { x: i, y: index }
                break
            }
        }
        return index
    }

    removeVirus(element) {
        this.viruses = this.viruses.filter(value => value != element)
        this.virusNumber.number--
        this.virusNumber.setPrecision()

        switch (element.color) {
            case "blue": {
                this.virusesCount[0]--
                break
            }
            case "red": {
                this.virusesCount[1]--
                break
            }
            case "yellow": {
                this.virusesCount[2]--
                break
            }
        }


        for (let i = 0; i < 3; i++) {
            if (this.virusesCount[i] == 0) {
                this.game.dancingViruses[i].animationFrame = 6
                this.game.dancingViruses[i].deleteTime = new Date().getTime()
            }
        }

        if (this.viruses.length == 0) {
            this.game.stageCleared()
        }
    }
    deleteFours() {
        if (this.toDelete.length == 0) return

        let deletedElements = []
        this.game.gameObjects = this.game.gameObjects.filter(element => {
            if (element.type == "deleted") {
                this.grid[element.x][element.y] = 0
                deletedElements.push(element)
                return false
            }
            return true
        })
        deletedElements.forEach(element => {
            if (element instanceof Virus) {
                this.game.addPoints()
                this.removeVirus(element)
            }
        })
        console.log(this.game.gameObjects)
        this.toDelete = []
    }

    clearFours() {
        let toClear = this.checkFours()
        if (toClear.length != 0) {
            this.speed = 250
            this.toDelete = toClear
        }

        for (let i = 0; i < toClear.length; i++) {
            let element = toClear[i]
            //if (this.grid[element.x][element.y]) {
            if (element instanceof Tile && !element.single) {
                let pairCoords = this.findPair(element)
                this.grid[pairCoords.x][pairCoords.y].single = true
                this.grid[pairCoords.x][pairCoords.y].type = "single"
            } else if (element instanceof Virus) {
                element.animationFrame = 5
            }
            element.type = "deleted"
            //}

        }
    }

    checkFours() {
        let coords = []

        for (let x = 0; x < this.grid.length; x++) {
            for (let y = this.grid[x].length - 1; y >= 3; y--) {
                //vertical
                if (this.grid[x][y] != 0 && this.grid[x][y - 1] != 0 && this.grid[x][y - 2] != 0 && this.grid[x][y - 3] != 0) {
                    if (this.grid[x][y].color == this.grid[x][y - 1].color &&
                        this.grid[x][y - 1].color == this.grid[x][y - 2].color &&
                        this.grid[x][y - 2].color == this.grid[x][y - 3].color) {
                        coords.push(this.grid[x][y])
                        coords.push(this.grid[x][y - 1])
                        coords.push(this.grid[x][y - 2])
                        coords.push(this.grid[x][y - 3])

                    }
                }
                //horizontal
                if (x < 5) {
                    if (this.grid[x][y] != 0 && this.grid[x + 1][y] != 0 && this.grid[x + 2][y] != 0 && this.grid[x + 3][y] != 0) {
                        if (this.grid[x][y].color == this.grid[x + 1][y].color &&
                            this.grid[x + 1][y].color == this.grid[x + 2][y].color &&
                            this.grid[x + 2][y].color == this.grid[x + 3][y].color) {
                            coords.push(this.grid[x][y])
                            coords.push(this.grid[x + 1][y])
                            coords.push(this.grid[x + 2][y])
                            coords.push(this.grid[x + 3][y])
                        }
                    }
                }
            }
        }
        coords = [...new Set(coords)]
        return coords
    }

    fallDown() {
        let checked = []
        let fallen = false
        for (let x = 0; x < this.grid.length; x++) {
            for (let y = this.grid[x].length - 2; y >= 0; y--) {
                if (this.grid[x][y] == 0 || this.grid[x][y] instanceof Virus) {
                    continue
                } else {
                    if (this.grid[x][y].single) {
                        if (this.grid[x][y + 1] == 0) {
                            this.grid[x][y].y++
                            this.grid[x][y + 1] = this.grid[x][y]
                            this.grid[x][y] = 0
                            fallen = true
                        }
                    } else {
                        if (!checked.includes(this.grid[x][y].id)) {
                            checked.push(this.grid[x][y].id)

                            if (this.grid[x][y].type == "bottom" || this.grid[x][y].type == "up") {
                                if (this.grid[x][y + 1] == 0) {
                                    this.grid[x][y].y++
                                    this.grid[x][y - 1].y++
                                    this.grid[x][y + 1] = this.grid[x][y]
                                    this.grid[x][y] = this.grid[x][y - 1]
                                    this.grid[x][y - 1] = 0
                                    fallen = true
                                }
                            } else if (this.grid[x][y].type == "right" || this.grid[x][y].type == "left") {
                                if (this.grid[x][y + 1] == 0 && this.grid[x + 1][y + 1] == 0) {
                                    console.log(this.grid[x + 1][y])
                                    this.grid[x][y].y++
                                    this.grid[x + 1][y].y++
                                    this.grid[x][y + 1] = this.grid[x][y]
                                    this.grid[x + 1][y + 1] = this.grid[x + 1][y]
                                    this.grid[x][y] = 0
                                    this.grid[x + 1][y] = 0
                                    fallen = true
                                }
                            }
                        }
                    }
                }
            }
            let toClear = this.checkFours()
            if (!fallen && toClear.length == 0 && this.game.canAddPill) {
                console.log("fallen")
                this.game.canAddPill = false
                this.game.gameObjects = this.game.gameObjects.filter(value => value != this.game.nextPill)
                for (let x = 0; x < this.game.board.grid.length; x++) {
                    for (let y = 0; y < this.game.board.grid[x].length; y++) {
                        let element = this.game.board.grid[x][y]
                        if (element && element instanceof Tile) {
                            element.x = x
                            element.y = y
                        }
                    }
                }

                if (this.game.board.grid[3][0] != 0 || this.game.board.grid[4][0] != 0) {
                    this.game.gameOver()
                } else {
                    if (this.game.currentPill instanceof Pill) {

                        this.game.currentPill = this.game.nextPill
                        this.game.currentPill.x = 3
                        this.game.currentPill.tiles[0].x = 4
                        this.game.currentPill.tiles[1].x = 3
                        this.game.currentPill.y = -1
                        this.game.currentPill.tiles[0].y = -1
                        this.game.currentPill.tiles[1].y = -1
                        this.game.currentPill.current = true
                        this.game.nextPill = new Pill(this.game)
                        this.game.nextPill.x = 10
                        this.game.nextPill.tiles[0].x = 14
                        this.game.nextPill.tiles[1].x = 13
                        this.game.nextPill.y = -3
                        this.game.nextPill.tiles[0].y = -3
                        this.game.nextPill.tiles[1].y = -3
                        this.game.gameObjects.push(this.game.nextPill)
                    }
                    this.canClear = false
                }
            } else if (!fallen) {
                this.canClear = false

            }
            else {
                this.canClear = true
            }
        }
    }
}