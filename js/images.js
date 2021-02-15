export default class Images {
    static array = [
        'dr-mario-sign',
        'tag',
        'bloke',
        'bloke-blue',
        'bloke-red',
        'bloke-yellow',
        'frame',
        'button',
        'clipboard',
        'magnifier',
        'jar',
        'mario',
        'virus-blue',
        'virus-red',
        'virus-yellow',
        'pill-blue',
        'pill-red',
        'pill-yellow',
        "background",
        "sc",
        "go"
    ]

    static async loadImages() {
        Images.images = Object.fromEntries(
            await Promise.all(
                Images.array.map(name => {
                    return new Promise((resolve, reject) => {
                        let newImage = new Image
                        newImage.src = `/images/${name}.png`
                        newImage.addEventListener('load', () => {
                            resolve([name, newImage])
                        })
                    })
                })
            )
        )
    }
    static getImage(name) {
        return Images.images[name]
    }
}


