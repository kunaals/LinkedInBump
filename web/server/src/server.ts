import * as http from 'http'
import * as https from 'https'
import * as fs from 'fs'
import * as cookie from 'cookie'
import * as qs from 'querystring'

import config from './config'
import {serveStatic} from './static'
import Session from './session'

//redirect http to https
http.createServer((request, response) => {
    response.writeHead(301, {'Location': 'https://' + request.headers['host'] + request.url})
    response.end()
}).listen(config.httpPort)

type RequestHandler = (request: https.IncomingMessage, reponse: https.ServerResponse, data: {[key: string]: any}, session: Session) => Promise<boolean>

let getHandlers: RequestHandler[] = [],
    postHandlers: RequestHandler[] = []

export function get(handler: RequestHandler) { getHandlers.push(handler) }
export function post(handler: RequestHandler) { postHandlers.push(handler) }

//main server
https.createServer({
    key:  fs.readFileSync(config.cert.key),
    cert: fs.readFileSync(config.cert.cert),
    ca:   fs.readFileSync(config.cert.ca)
}, async (request, response) => {
    try {
        let c = cookie.parse(request.headers['cookie'] as string || ''),
            session = 'session' in c ?  Session.get(c.session) : null,
            dataStr = '',
            data: {[k: string]: any} = {},
            handlers: RequestHandler[] = [],
            handled = false
        
        if (session == null) {
            session = await Session.create()
            response.setHeader('Set-Cookie', cookie.serialize('session', session.key, {
                httpOnly: true,
                secure: true,
                maxAge: 365 * 24 * 60 * 60
            }))
        }

        //try to parse the get/ppost form data
        try {
            if (request.method === 'POST') {
                await new Promise((resolve, reject) => {
                    request.on('data', d => {
                        dataStr += d
                        if (dataStr.length > 4 * 1024)
                            request.connection.destroy()
                    })

                    request.on('end', () => {
                        resolve()
                    })
                })
                handlers = postHandlers
            } else if (request.method === 'GET' && request.url && request.url.indexOf('?') !== -1) {
                dataStr = request.url.substring(request.url.indexOf('?') + 1)
                handlers = getHandlers
            }
            data = qs.parse(dataStr) || {}
        } catch (e) {
            response.writeHead(400)
            response.end('bad request')
            return
        }

        for (let h of handlers) {
            handled = await h(request, response, data, session)
            if (handled) break
        }

        if (!handled) serveStatic(request, response)
    } catch (e) {
        console.log(e)
        response.writeHead(500)
        response.end('internal server error')
    }
}).listen(config.httpsPort)

require('./linkedin')
require('./bump')