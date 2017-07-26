import * as React from 'react'
import Login from './login'
import Bump from './bump'

enum LocationState {
    Detecting,
    Found,
    NotFound
}

interface AppState {
    logged: boolean
    name?: string
    headline?: string
    photo?: string
    url?: string
    locationState: LocationState
}

export default class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props)
        this.state = {
            logged: !!((window as any)['logged']),
            locationState: LocationState.Detecting
        }
    }
    componentWillMount() {
        if (this.state.locationState === LocationState.Detecting) {
            if (navigator.geolocation) {
                //navigator.geolocation.getCurrentPosition(l => {
                    this.setState({locationState: LocationState.Found})
                //}, () => {
                    //this.setState({locationState: LocationState.NotFound})
                //})
            } else {
                this.setState({locationState: LocationState.NotFound})
            }
        }
        if (!this.state.logged) return
        let r = new XMLHttpRequest()
        r.addEventListener("load", () => {
            if (r.readyState === r.DONE && r.status === 200) {
                try {
                    let user = JSON.parse(r.responseText)
                    let name = ''
                    if (user.formattedName)
                        this.setState({name: user.formattedName})
                    if (user.headline)
                        this.setState({headline: user.headline})
                    if (user.publicProfileUrl)
                        this.setState({url: user.publicProfileUrl})
                    if (user.pictureUrl)
                        this.setState({photo: user.pictureUrl})
                } catch (e) {}
            }
        })
        r.open("GET", "/?api=user")
        r.send()
    }
    render() {
        if (this.state.locationState === LocationState.Detecting) return <span />
        let content = this.state.locationState === LocationState.Found ? (
            <div>
                {!this.state.logged && <Login />}
                {this.state.logged && this.state.name && <Bump url={this.state.url} name={this.state.name} headline={this.state.headline} photo={this.state.photo} />}
            </div>
        ) : (
            <h2>Unable to find location</h2>
        )
        return (
            <main>
                <header><h1>LinkedIn</h1></header>
                {content}
            </main>
        )
    }
}