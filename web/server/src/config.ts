import * as fs from 'fs'

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'))

export default config