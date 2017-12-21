const pino = require('pino')

const logger = pino().child({
    service: 'ocomis-user-api'
})

module.exports = logger
