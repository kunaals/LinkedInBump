import * as React from 'react'
import User from './user'

interface BumpProps {
    name: string
    photo?: string
    headline?: string
    url?: string
}

interface User {
    name: string
    photo?: string
    headline?: string
    url: string
}

interface BumpState {
    latitude?: number
    longitude?: number
    bump: boolean
    connected?: User | null
}

export default class Bump extends React.Component<BumpProps, BumpState> {
    orientListener: any
    posWatch: number
    id: string
    constructor(props: BumpProps) {
        super(props)
        this.state = {
            bump: false
        }
    }
    componentWillMount() {
        this.id = (new Date()).getTime() + ""

        if ((window as any).DeviceOrientationEvent) {
            this.orientListener = (e: DeviceOrientationEvent) => {
                if (e.alpha != null && e.beta != null && e.gamma != null)
                    tilt(e.alpha, e.beta, e.gamma)
            }
            window.addEventListener('deviceorientation', this.orientListener, true)
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(() => {
                    this.posWatch = navigator.geolocation.watchPosition(p => {
                        if (document.hidden) return
                        this.setState({latitude: p.coords.latitude, longitude: p.coords.longitude})
                    }, () => {}, {enableHighAccuracy: true})
                })
            }
        }

        let la: number, lb: number, lc: number, lt: number, loc: number, sample = 0

        let tilt = (a: number, b: number, c: number) => {
            if (document.hidden) {
                sample = 0
                return
            }
            if (lt != null) {
                let dt = ((new Date()).getTime() - lt) / 1000,
                    da = Math.abs(a - la) / dt,
                    db = Math.abs(b - lb) / dt,
                    dc = Math.abs(c - lc) / dt,
                    v = Math.max(da, db, dc)
                if (v > 400 && sample > 100)
                    this.doBump()
                else
                    sample++
            }
            la = a
            lb = b
            lc = c
            lt = (new Date()).getTime()
        }
    }
    componentWillUnmount() {
        if (this.orientListener) window.removeEventListener('deviceorientation', this.orientListener, true)
        if (this.posWatch) navigator.geolocation.clearWatch(this.posWatch)
    }
    doBump = () => {
        if (this.state.bump || !this.props.url || document.hidden || this.state.connected || this.state.latitude == null) return
        this.setState({bump: true})
        let r = new XMLHttpRequest()
        r.addEventListener("load", () => {
            if (r.readyState === r.DONE && r.status === 200) {
                this.setState({bump: false})
                try {
                    let u = JSON.parse(r.responseText) as User
                    if (!u) return
                    this.setState({connected: u})
                } catch (e) {}
            }
        })
        let payload: User = {
            name: this.props.name,
            headline: this.props.headline,
            photo: this.props.photo,
            url: this.props.url
        }
        r.open("GET", "/?api=bump&id=" + this.id +  "&data=" + encodeURIComponent(JSON.stringify(payload)) + '&lat=' + this.state.latitude + '&lon=' + this.state.longitude)
        r.send()
    }
    render() {
        if (!this.props.url)
            return <div className="bump"><h2>Please make your profile visible</h2></div>
        if (this.state.connected)
            return <User {...this.state.connected} cancel={() => this.setState({connected: null})}/>
        return (
            <div className="bump">
                {this.state.bump || this.state.latitude == null ? <div className="loader" /> : <User name={this.props.name} url={this.props.url} photo={this.props.photo} headline={this.props.headline} />}
                <h2>{this.state.bump ? '' : this.state.latitude == null ? 'Loading Location' :  'Bump to connect'}</h2>
            </div>
        )
    }
}