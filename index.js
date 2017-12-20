const Hapi = require('hapi')
const pino = require('pino')
const HapiPino = require('hapi-pino')
const Routes = require('./lib/routes')
const DB = require('./lib/models/db')

const server = new Hapi.Server()

function provision () {
    return new Promise((resolve, reject) => {
        server.connection({
            port: 3002
        })

        server.route(Routes)

        const logger = pino().child({
            service: 'ocomis-user-api'
        })

        server.register({
            register: HapiPino,
            options: {
                instance: logger
            }
        }, (error) => {
            if (error) {
                return reject(error)
            }

            DB.migrate.latest().then(() => {
                server.logger().info('Ocomis User DB Migration finished.')
                server.start().then(resolve).catch(reject)
            }).catch(reject)
        })
    })
}

provision().then(() => {
    server.logger().info('Ocomis User API Service started.')
    server.logger().info(`Server running at: ${server.info.uri}`)
}).catch((error) => {
    server.logger().error('Ocomis User API Service start failed: ' + error)
    process.exit(1)
})

module.exports = server // only for testing
