export default class Keyboard {

    static listeners = []

    static init() {
        this.keys = {}
        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.key] || !this.keys[e.key].pressed) {
                this.keys[e.key] = { pressed: true, time: Date.now() }
                this.listeners.forEach(listener => listener(e.key))
            }
        })
        window.addEventListener('keyup', (e) => {
            this.keys[e.key].pressed = false
        })
    }
    static isKeyDown(key) {
        return this.keys[key]
    }
    static update() {
        for (let [key, { pressed, time }] of Object.entries(this.keys)) {
            if (pressed && Date.now() - time >= 500) {
                this.keys[key] = { pressed: true, time: Date.now() }
                this.listeners.forEach(listener => listener(key))
            }
        }
    }

    static addListener(listener) {
        this.listeners.push(listener)
    }

    static removeListener(listener) {
        this.listeners = this.listeners.filter(l => l != listener)
    }

}