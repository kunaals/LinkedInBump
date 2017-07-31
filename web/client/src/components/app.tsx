import * as React from 'react'
import Login from './login'
import Bump from './bump'

interface AppState {
    logged: boolean
    name?: string
    headline?: string
    photo?: string
    url?: string
    loaded: boolean
}

export default class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props)
        this.state = {
            logged: false,
            loaded: false
        }
    }
    componentWillMount() {
        let r = new XMLHttpRequest()
        r.addEventListener("load", () => {
            if (r.readyState === r.DONE && r.status === 200) {
                try {
                    let user = JSON.parse(r.responseText)
                    if (user != null) {
                        this.setState(user)
                        this.setState({logged: true})
                    } else {
                        this.setState({logged: false})
                    }
                } catch (e) {} finally {
                    this.setState({loaded: true})
                }
            }
        })
        r.open("POST", "/")
        r.send('api=user')
    }
    componentDidUpdate() {
        if (this.state.loaded && !this.state.name)
            this.setState({logged: false, loaded: false})
    }
    render() {
        return (
            <main>
                <header><h1>LinkedIn</h1></header>
                <div>
                    {!this.state.logged && <Login />}
                    {this.state.logged && this.state.name && this.state.url && <Bump url={this.state.url} name={this.state.name} headline={this.state.headline} photo={this.state.photo} />}
                </div>
            </main>
        )
    }
}