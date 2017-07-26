import * as React from 'react'

export default class BumpAnim extends React.Component<{}, {}> {
    render() {
        return (
            <div className="bump-anim">
                <div className="line" />
                <div className="phone">
                    <div className="top" />
                    <div className="body"><span>Bump</span><span>to</span><span>connect</span></div>
                </div>
            </div>
        )
    }
}