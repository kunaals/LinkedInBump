import * as https from 'https'
import * as crypto from 'crypto'
import * as fs from 'fs'
import * as qs from 'querystring'

import config from './config'

export function genKey(enc:crypto.HexBase64Latin1Encoding = 'base64'): Promise<string> {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(256, (err, buf) => {
            if (err) {
                reject(err)
            } else {
                try {
                    let hash = crypto.createHash('sha256')
                    hash.update(buf)
                    resolve(hash.digest(enc))
                } catch (e) {
                    reject(e)
                }
            }
        })
    })
}

export function readIfExists(path: string): Promise<Buffer | null> {
    return new Promise((resolve, reject) => {
        fs.readFile(config.staticFilesDir + path, (err, data) => {
            if (err)
                resolve(null)
            else
                resolve(data)
        })
    })
}

export function lastModified(path: string): Promise<number | null> {
    return new Promise((resolve, reject) => {
        fs.stat(config.staticFilesDir + path, (err, stat) => {
            if (err)
                resolve(null)
            else
                resolve(stat.mtime.getTime())
        })
    })
}

export function request(method: 'POST' | 'GET', host: string, path: string, data: {[k: string]: any}, headers?: {[n: string]: string}): Promise<string> {
    return new Promise((resolve, reject) => {
        let send = qs.stringify(data)
        https.request({
            host: host,
            port: 443,
            path: path + (method === 'GET' ? send : ''),
            method: method,
            headers: Object.assign(headers || {}, method === 'POST' ? {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(send)
            } : {})
        }, res => {
            let data = ''
            res.on('data', d => {
                data += d
            })
            res.on('end', () => {
                resolve(data)
            })
        }).end(method === 'POST' ? send : '')
    })
}