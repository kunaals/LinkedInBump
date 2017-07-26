import * as React from 'react'

interface UserProps {
    photo?: string
    headline?: string
    name: string
    url: string
    cancel?: () => void
}

export default function User({photo, name, headline, url, cancel}: UserProps) {
    return (
        <div className="user">
            <div className="photo" style={photo ? {backgroundImage: `url(${photo})`} : {}} />
            <div className="name">{name}</div>
            {headline && <div className="headline">{headline}</div>}
            {cancel && <a onClick={cancel} href={url} target="_blank" className="connect">Connect</a>}
            <br />
            {cancel && <button className="cancel" onClick={cancel}>Back</button>}
        </div>
    )
}