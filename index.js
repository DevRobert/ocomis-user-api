const Hapi = require('hapi')
const HapiPino = require('hapi-pino')
const Routes = require('./lib/routes')
const DB = require('./lib/models/db')

const server = new Hapi.Server()

function provision () {
    return new Promise((fulfill, reject) => {
        server.connection({
            port: 3002
        })

        server.route(Routes)

        server.register(HapiPino, (error) => {
            if (error) {
                return reject(error)
            }

            DB.migrate.latest().then(() => {
                server.logger().info('Ocomis User DB Migration finished.')
                server.start().then(fulfill).catch(reject)
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
