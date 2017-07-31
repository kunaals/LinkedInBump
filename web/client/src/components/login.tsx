import * as React from 'react'

export default class Login extends React.Component<{}, {}> {
    render() {
        return (
            <form className="login" method="POST" action="/">
                <button name="api" value="login">
                    <img src="linkedin.png" />
                    <span>Sign In</span>
                </button>
            </form>
        )
    }
}