const Hapi = require('hapi')
const HapiPino = require('hapi-pino')
const HapiAuthJwt2 = require('hapi-auth-jwt2')
const Config = require('config')
const Routes = require('./lib/routes')
const DB = require('./lib/models/db')
const logger = require('./lib/logger')
const validateToken = require('./lib/models/validate_token')

const server = new Hapi.Server()

function provision () {
    return new Promise((resolve, reject) => {
        server.connection({
            port: Config.get('server.port'),
            routes: {
                cors: true
            }
        })

        const plugins = [
            { register: HapiPino, options: { instance: logger } },
            HapiAuthJwt2
        ]

        server.register(plugins, (error) => {
            if (error) {
                reject(error)
                return
            }

            server.auth.strategy('jwt', 'jwt', {
                key: Config.get('jwt.secret'),
                validateFunc: validateToken,
                verifyOptions: {
                    algorithms: [ 'HS256' ]
                },
                cookieKey: Config.get('jwt.cookieKey')
            })

            server.auth.default('jwt')

            server.route(Routes)

            DB.migrate.latest().then(() => {
                logger.info('Ocomis User DB Migration finished.')
                server.start().then(resolve).catch(reject)
            }).catch(reject)
        })
    })
}

provision().then(() => {
    logger.info('Ocomis User API Service started.')
    logger.info(`Server running at: ${server.info.uri}`)
}).catch((error) => {
    logger.error('Ocomis User API Service start failed: ' + error)
    process.exit(1)
})

module.exports = server // only for testing
