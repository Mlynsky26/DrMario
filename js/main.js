import Game from "./game.js"
import Images from "./images.js"

async function main() {
    await Images.loadImages()

    const canvas = document.getElementById("canvas")
    canvas['imageSmoothingEnabled'] = false
    canvas['mozImageSmoothingEnabled'] = false
    canvas['webkitImageSmoothingEnabled'] = false
    canvas.style.imageRendering = 'pixelated'
    const ctx = canvas.getContext("2d")

    const game = new Game(canvas.height, canvas.width, ctx)
    function gameLoop(timestamp) {
        game.drawBackground()
        game.update(Math.floor(timestamp))
        game.draw(ctx)
        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);

}

main()

