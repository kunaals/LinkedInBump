import * as React from 'react'

export default class Login extends React.Component<{}, {}> {
    doLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        let params: {[k: string]: string} = {
            response_type: 'code',
            client_id: '86bnycal7ck9ip',
            redirect_uri: 'https://linkedinbump.online', 
            state: (new Date()).getTime() + ''
        }
        let req = Object.keys(params).map(a => a + '=' + encodeURIComponent(params[a])).join('&')
        window.location.replace('https://www.linkedin.com/oauth/v2/authorization?' + req)
    }
    render() {
        return (
            <div className="login">
                <button onClick={this.doLogin}>
                    <img src="linkedin.png" />
                    <span>Sign In</span>
                </button>
            </div>
        )
    }
}