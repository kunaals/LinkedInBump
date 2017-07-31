import * as React from 'react'
import User from './user'
import BumpAnim from './bump-anim'

interface BumpProps {
    name: string
    photo?: string
    headline?: string
    url: string
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
    accuracy?: number
    bump: boolean
    connected?: User | null
    error: string
}

export default class Bump extends React.Component<BumpProps, BumpState> {
    moveListener: any
    posWatch: number
    id: string
    constructor(props: BumpProps) {
        super(props)
        this.state = {
            bump: false,
            error: ''
        }
    }
    componentWillMount() {
        this.id = (new Date()).getTime() + ""

        if ('ondevicemotion' in window && navigator.geolocation) {
            this.moveListener = (e: DeviceMotionEvent) => {
                if (e.accelerationIncludingGravity)
                    tilt(e.accelerationIncludingGravity.x || 0, e.accelerationIncludingGravity.y || 0, e.accelerationIncludingGravity.z || 0)
            }
            window.addEventListener('devicemotion', this.moveListener, true)
            this.setupLocation()
        } else {
            this.setState({error: 'This device is not supported'})
        }

        let cal = 0, sample = 0

        let tilt = (a: number, b: number, c: number) => {
            let d = a * a + b * b + c * c
            if (document.hidden || this.state.bump) {
                sample = 0
                return
            }
            if (sample > 100) {
                if ((cal / sample) * 6 < d) {
                    this.doBump()
                    sample = 0
                    cal = 0
                }
            }
            if (sample < 100000) {
                cal += d
                sample++
            }
        }
    }
    componentWillUnmount() {
        if (this.moveListener) window.removeEventListener('deviceorientation', this.moveListener, true)
        if (this.posWatch) navigator.geolocation.clearWatch(this.posWatch)
    }
    setupLocation() {
        if (this.posWatch) navigator.geolocation.clearWatch(this.posWatch)
        
        let listener: PositionCallback = p => {
            if (document.hidden) return
            this.setState({error: '', latitude: p.coords.latitude, longitude: p.coords.longitude, accuracy: p.coords.accuracy})
        },
        eListener: PositionErrorCallback = e => {
            if (e.code === e.PERMISSION_DENIED || e.code === e.POSITION_UNAVAILABLE)
                this.setState({error: 'Please enable location data'})
            else
                this.setState({error: 'Unable to find location'})
        }
        navigator.geolocation.getCurrentPosition(p => {
            this.posWatch = navigator.geolocation.watchPosition(listener, eListener, {enableHighAccuracy: true})
            listener(p)
        }, eListener, {enableHighAccuracy: true})
        
    }
    doBump = () => {
        if (this.state.bump || this.state.error || document.hidden || this.state.connected || this.state.latitude == null) return
        this.setState({bump: true})
        let r = new XMLHttpRequest()
        r.addEventListener("load", () => {
            if (r.readyState === r.DONE && r.status === 200) {
                this.setState({bump: false})
                try {
                    let u = JSON.parse(r.responseText)
                    if (!u) return
                    if (u.error) {window.location.reload(); return}
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
        r.open("POST", '/')
        r.send('api=bump&acc=' + this.state.accuracy + '&lat=' + this.state.latitude + '&lon=' + this.state.longitude)
    }
    render() {
        if (this.state.error)
            return <div className="bump"><h2>{this.state.error}</h2></div>
        if (this.state.connected)
            return (
                <div>
                     <h1 className="bumped">Bumped With</h1>
                    <User {...this.state.connected} cancel={() => this.setState({connected: null})}/>
                </div>
            )
        return (
            <div className="bump">
                {this.state.bump || this.state.latitude == null ? <div className="loader" /> : <User name={this.props.name} url={this.props.url} photo={this.props.photo} headline={this.props.headline} />}
                {this.state.bump ? false : this.state.latitude == null ? <h2>Loading Location</h2> :  <BumpAnim />}
            </div>
        )
    }
}