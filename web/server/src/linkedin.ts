import * as qs from 'querystring'

import {get, post} from './server'
import {genKey, request} from './helpers'
import config from './config'

export interface LinkedInProfile {
    id: string
    name: string
    headline?: string
    photo?: string
    url: string
}

async function getProfileInfo(token: string): Promise<LinkedInProfile | null> {
    try {
        let resp = JSON.parse(await request('GET', 'api.linkedin.com', '/v1/people/~:(id,formatted-name,headline,site-standard-profile-request,picture-url)', {}, {
            'Authorization': 'Bearer ' + token,
            'x-li-format': 'json'
        }))
        if (!(resp.id && resp.formattedName && resp.siteStandardProfileRequest && resp.siteStandardProfileRequest.url)) return null
        return {
            id: resp.id,
            name: resp.formattedName,
            url: resp.siteStandardProfileRequest.url,
            headline: resp.headline,
            photo: resp.pictureUrl
        }
    } catch (e) {
        console.log(e)
        return null
    }
}

//perform the oauth login redirect
post(async (request, response, data, session) => {
    if (data.api === 'login') {
        let state = await genKey()
        session.data.state = state

        let params = {
            response_type: 'code',
            client_id: config.apiKey,
            redirect_uri: 'https://' + request.headers['host'], 
            state: state
        }
        response.writeHead(302, {
            'Location': 'https://www.linkedin.com/oauth/v2/authorization?' + qs.stringify(params)
        })
        response.end()
        return true
    }
    return false
})

//update session if oauth login was a success and redirect to /
get(async (req, response, data, session) => {
    if (data.state) {
        session.data.token = null
        session.data.profile = null
        if (session.data.state === data.state) {
            if (data.code) {
                try {
                    let resp = JSON.parse(await request('POST', 'www.linkedin.com', '/oauth/v2/accessToken', {
                        grant_type: 'authorization_code',
                        code: data.code,
                        redirect_uri: 'https://' + req.headers['host'],
                        client_id: config.apiKey,
                        client_secret: config.secretKey
                    }))
                    if (resp.access_token) {
                        let token = resp.access_token,
                            profile = await getProfileInfo(token)
                        if (profile != null) {
                            session.data.token = token
                            session.data.profile = profile
                            console.log('Logged in: ' + profile.name)
                        }
                    }
                } catch (e) {
                    console.log(e)
                }
            } else {
                //login failed
            }
        }
        session.data.state = null
        response.writeHead(302, {'Location': '/'})
        response.end()
        return true
    }
    return false
})

//tell the app what the user's profile info is
post(async (request, response, data, session) => {
    if (data.api === 'user') {
        if (session.data.profile)
            response.end(JSON.stringify(session.data.profile))
        else
            response.end('null')
        return true
    }
    return false
})