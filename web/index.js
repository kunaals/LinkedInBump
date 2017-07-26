let http = require('http'),
    https = require('https'),
    fs = require('fs'),
    qs = require('querystring'),
    cookie = require('cookie'),
    crypto = require('crypto')

let bumps = {}

function process() {
    let times = []
    for (let id in bumps) {
        times.push(bumps[id])
    }
    let now = (new Date()).getTime()
    for (let i = times.length - 1; i >= 0; i--) {
        if (now - times[i].time > 1000) {
            times[i].end(null)
            times.splice(i, 1)
        }
    }
    if (times.length < 2) return
    for (let i = 0; i < times.length; i++) {
        let list = [], b1 = times[i]
        for (let j = 0; j < times.length; j++) {
            if (i == j) continue;
            let b2 = times[j]
            if (Math.abs(b1.time - b2.time) < 500) {
                list.push(b2)
            }
        }
        list.sort((a, b) => b1.dist(a) - b1.dist(b))

        if (list.length) {
            b1.end(list[0])
            list[0].end(b1)
            console.log('distance: ' + b1.dist(list[0]))
            return
        }
    }
}

setInterval(process, 200)

function deg2rad(deg) {
    return deg / 180 * Math.PI
}

class BumpRequest {
    constructor(id, time, data, response, lat, lon) {
        this.id = id
        this.time = time.getTime()
        this.data = data
        this.lat = lat
        this.lon = lon
        if (id in bumps) bumps[id].end()
        bumps[id] = this
        this.response = response
    }
    end(other) {
        delete bumps[this.id]
        if (other != null)
            this.response.end(other.data + '\n')
        else
            this.response.end('false\n')
    }
    dist(o) {
        let R = 6371e3,
            φ1 = deg2rad(this.lat),
            φ2 = deg2rad(o.lat),
            Δφ = deg2rad((o.lat-this.lat)),
            Δλ = deg2rad((o.lon-this.lon))

        return Math.acos(Math.sin(φ1)*Math.sin(φ2) + Math.cos(φ1)*Math.cos(φ2) * Math.cos(Δλ)) * R
    }
}

const keypath = '/etc/letsencrypt/live/linkedinbump.online/'

const options = {
  key: fs.readFileSync(keypath + 'privkey.pem'),
  cert: fs.readFileSync(keypath + 'fullchain.pem'),
    ca: fs.readFileSync(keypath + 'chain.pem')
}

http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);

const files = './client/dist'

let sessions = {}

function writeApp(logged) {
    return fs.readFileSync(files + '/index.html').toString().replace('<!--Insert-->', `<script>
    window['logged'] = ${logged ? 'true' : 'false'};
    </script>`)
}

let s = https.createServer(options, (request, response) => {
    let session = false
    if (request.headers.cookie) {
		let c = cookie.parse(request.headers.cookie)

		if (c.token && c.token in sessions) {
			session = sessions[c.token]
		}
	}
    if (request.method === 'GET' && request.url.indexOf('?') !== -1) {
        let q = qs.parse(request.url.substring(request.url.indexOf('?') + 1))
        if (q.api == 'bump') {
            let ip = request.connection.remoteAddress
            let b = new BumpRequest(q.id, new Date(), q.data, response, q.lat, q.lon)
        } else if (q.api == 'user' && session) {
            let req = https.request({
                host: 'api.linkedin.com',
                port: 443,
                path: '/v1/people/~:(formatted-name,headline,public-profile-url,picture-url)',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + session.tok,
                    'x-li-format': 'json'
                }
            }, (res) => {
                let data = ''
                res.on('data', d => {
                    data += d
                })
                res.on('end', () => {
                    response.end(data)
                })
            }).end()
        } else if (q.code) {
            let send = qs.stringify({
                grant_type: 'authorization_code',
                code: q.code,
                redirect_uri: 'https://linkedinbump.online',
                client_id: '86bnycal7ck9ip',
                client_secret: 'ZK6PRRZ5u7HiibDQ'
            })
            let req = https.request({
                host: 'www.linkedin.com',
                post: 443,
                path: '/oauth/v2/accessToken',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(send)
                }
            }, res => {
                let data = ''
                res.on('data', d => {
                    data += d
                })
                res.on('error', () => {
                    response.end(writeApp())
                })
                res.on('end', () => {
                    let acc = JSON.parse(data)
                    if (acc.access_token) {
                        let h = crypto.createHash('sha256')
                        h.update(acc.access_token + (new Date()).getTime())
                        let token = h.digest('hex')
                        sessions[token] = {
                            tok: acc.access_token
                        }
                        response.writeHead(302, {
                            'Set-Cookie': cookie.serialize('token', token, Object.assign({
                                httpOnly: true,
                                secure: true,
                                path: '/'
                            }, {})),
                            'Location': '/'})
                        response.end()
                    } else {
                        response.end(writeApp())
                    }
                })
            })
            req.end(send)
        } else if (q.error) {
            response.end(writeApp())
        } else {
            response.end(writeApp())
        }
    } else {
        try {
            if (fs.existsSync(files + request.url))
                response.end(fs.readFileSync(files + request.url))
            else
                response.end(writeApp(!!session))
        } catch (e) {
            response.end(writeApp(!!session))
        }
    }
});
s.timeout = 10000

s.listen(443)

