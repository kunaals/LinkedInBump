import {genKey} from './helpers'
import config from './config'

let sessions: {[key: string]: Session} = {}

export default class Session {
    created: number
    lastUsed: number
    key: string
    data: {[k: string]: any}
    timer: number

    static async create() {
        let s: Session = new Session()

        s.created = (new Date()).getTime()
        s.lastUsed = s.created
        s.data = {}
        s.key = await genKey()
        s.timer = setTimeout(s.check.bind(s), config.sessionTimeout)

        sessions[s.key] = s

        return s
    }

    static get(key: string) {
        let s = sessions[key]
        if (!s) return null
        s.lastUsed = (new Date()).getTime()

        return s
    }

    delete() {
        clearTimeout(this.timer)
        delete sessions[this.key]
    }

    check() {
        let t = Object.keys(this.data).length === 0 ? config.sessionTimeout : config.signedInTimeout
        if ((new Date()).getTime() - this.lastUsed > t)
            this.delete()
        else
            this.timer = setTimeout(this.check.bind(this), config.sessionTimeout);
    }
}