import * as https from 'https'

import config from './config'
import {post} from './server'
import {LinkedInProfile} from './linkedin'

interface Location {
    latitude: number
    longitude: number
    accuracy: number
}

let bumps: BumpRequest | null = null //linked list of current bump requests

function deg2rad(deg: number) {
    return deg / 180 * Math.PI
}

//TODO: rate limiting
class BumpRequest {
    response: https.ServerResponse
    location: Location
    profile: LinkedInProfile
    timer: number
    match: BumpRequest | null
    ended: boolean

    //linked list
    prev: BumpRequest | null
    next: BumpRequest | null

    constructor(response: https.ServerResponse, profile: LinkedInProfile, lat: string | null, lon: string | null, acc: string | null) {
        this.response = response
        this.profile = profile
        this.location = {
            latitude: parseFloat(lat || ''),
            longitude: parseFloat(lon || ''),
            accuracy: parseFloat(acc || '')
        }
        if (!(Number.isFinite(this.location.latitude) && Number.isFinite(this.location.longitude) && Number.isFinite(this.location.accuracy) && this.location.accuracy > 0)) {
            this.end()
            return
        }
        
        this.timer = setTimeout(this.end.bind(this), config.bumpTime)

        this.prev = null
        this.next = bumps
        if (bumps != null) bumps.prev = this
        bumps = this

        this.ended = false

        this.findMatch()
    }

    findMatch() {
        let bestMatch = this.match
        for (let bump = bumps; bump != null; bump = bump.next) {
            if (bump === this || bump.profile.id === this.profile.id) continue
            let dist = this.distanceTo(bump)
            if (dist - this.location.accuracy - bump.location.accuracy > 5) continue
            if ((bestMatch == null || dist < this.distanceTo(bestMatch))
             && (bump.match == null || dist < bump.distanceTo(bump.match))) {
                 bestMatch = bump
            }
        }
        if (bestMatch != this.match && bestMatch != null) {
            let prev1 = this.match, prev2 = bestMatch.match
            this.match = bestMatch
            bestMatch.match = this
            if (prev1 != null) prev1.match = null
            if (prev2 != null) prev2.match = null
            if (prev1 != null) prev1.findMatch()
            if (prev2 != null) prev2.findMatch()
        }
    }

    distanceTo(o: BumpRequest) {
        let R = 6371e3,
            φ1 = deg2rad(this.location.latitude),
            φ2 = deg2rad(o.location.latitude),
            Δφ = deg2rad((o.location.latitude-this.location.latitude)),
            Δλ = deg2rad((o.location.longitude-this.location.longitude))

        return Math.acos(Math.sin(φ1)*Math.sin(φ2) + Math.cos(φ1)*Math.cos(φ2) * Math.cos(Δλ)) * R
    }

    end() {
        if (this.ended) return
        this.ended = true
        if (this.timer) clearTimeout(this.timer)

        //delete from linked list
        if (this.prev == null) 
            bumps = this.next
        else
            this.prev.next = this.next
        if (this.next != null)
            this.next.prev = this.prev

        if (this.match == null) {
            console.log('Failed to bump: ' + this.profile.name)
            this.response.end('false')
        } else {
            console.log('Bumped: ' + this.profile.name + ' to ' + this.match.profile.name + ', dist: ' + this.distanceTo(this.match))
            this.response.end(JSON.stringify(this.match.profile))
            this.match.end()
        }
    }
}

post(async (request, response, data, session) => {
    if (data.api === 'bump') {
        if (!session.data.profile)
            response.end('{"error": true}')
        else
            new BumpRequest(response, session.data.profile, data.lat, data.lon, data.acc)

        return true
    }
    return false
})