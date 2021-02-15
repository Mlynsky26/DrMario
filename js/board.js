import Virus from "./virus.js"
import Tile from "./tile.js"


export default class Board {
    constructor(game) {
        this.game = game
        this.width = 8
        this.height = 16
        this.grid = this.createEmptyGrid()
        this.colors = ["blue", "red", "yellow"]
        this.virusesCount = [0, 0, 0]
        this.viruses = this.generateViruses(this.game.level)
        this.lastFall = 0
        this.canFall = false
        this.speed = 20
        this.toDelete = []

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
        for (let i = 0; i < 3 + level; i++) {

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
            this.speed = 20
            this.deleteFours()
            this.fallDown()
            this.lastFall = timestamp
        }
        if (!this.canFall) {
            this.clearFours()
            this.canFall = true
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
        if (this.viruses.length == 0) {
            this.game.stageCleared()
        }
    }
    deleteFours() {
        if (this.toDelete.length == 0) return

        for (let i = 0; i < this.toDelete.length; i++) {
            let element = this.toDelete[i]
            let index = this.game.gameObjects.findIndex(e => e.x == element.x && e.y == element.y)
            if (index != -1) {
                this.game.gameObjects.splice(index, 1)
            }
            this.grid[element.x][element.y] = 0
            if (element instanceof Virus) {
                this.game.addPoints()
                this.removeVirus(element)
            }
        }
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

            if (element instanceof Tile && !element.single) {
                let pairCoords = this.findPair(element)
                this.grid[pairCoords.x][pairCoords.y].single = true
                this.grid[pairCoords.x][pairCoords.y].type = "single"
            }
            this.grid[element.x][element.y].type = "deleted"
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
                            } else {
                                if (this.grid[x][y + 1] == 0 && this.grid[x + 1][y + 1] == 0) {
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
            if (!fallen) {
                this.canFall = false
            } else {
                this.canFall = true
            }
        }
    }
}