import * as http from 'http'
import * as crypto from 'crypto'
import {URL} from 'url'

import {lastModified, readIfExists} from './helpers'
import config from './config'

//async helpers for reading files



const mime: {[ext: string]: string} = {
    'html': 'text/html',
    'js': 'text/javascript',
    'css': 'text/css',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'xml': 'text/xml',
    'ico': 'image/x-icon',
    'json': 'application/json',
    'svg': 'image/svg+xml'
}

interface FileCacheEntry {
    etag: string
    time: number
    mime: string
    data: Buffer
}

let cache: {[k: string]: FileCacheEntry} = {}

export async function serveStatic(request: http.IncomingMessage, response: http.ServerResponse) {
    let u = new URL(request.url || '/', 'https://' + request.headers['host']),
        f = u.pathname,
        t = (new Date()).getTime(),
        serve: FileCacheEntry | null = null
    //look for index file
    f = f.lastIndexOf('/') === f.length - 1 ? f + 'index.html' : f

    if (f in cache) {
        let cached = cache[f]
        if (t - cached.time > config.staticTTL) {
            let modified = await lastModified(f)
            if (modified == null || modified > cached.time) {
                delete cache[f]
            } else {
                serve = cached
                cached.time = t
            }
        } else {
            serve = cached
        }
    }

    if (serve == null) {
        let file = await readIfExists(f)
        if (file != null) {
            let ext = f.lastIndexOf('.') === -1 ? '' : f.substring(f.lastIndexOf('.') + 1),
                hash = crypto.createHash('sha256')
            hash.update(file)
            serve = {
                etag: `"${hash.digest('base64')}"`,
                mime: mime[ext] || 'application/octet-stream',
                time: t,
                data: file
            }
            cache[f] = serve
        } else {
            response.writeHead(404)
            response.end()
            return
        }
    }

    if ('if-none-match' in request.headers && request.headers['if-none-match'] === serve.etag) {
        response.writeHead(304)
        response.end()
    } else {
        response.writeHead(200, {
            'Content-Type': serve.mime,
            'ETag': serve.etag,
            'Cache-Control': 'max-age=' + (Math.round(config.staticTTL / 1000) | 0),
            'Content-Length': serve.data.length
        })
        response.end(serve.data)
    }
}