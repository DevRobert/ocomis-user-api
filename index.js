const Hapi = require('hapi')
const HapiPino = require('hapi-pino')
const Routes = require('./lib/routes')
const DB = require('./lib/models/db')
const good = require('good')

const server = new Hapi.Server()

async function provision () {
    await DB.migrate.latest()

    server.connection({
        port: 3002
    })

    server.route(Routes)

    const goodOptions = {
        ops: {
            interval: 30000 // report ops stats every 30 seconds
        },
        reporters: {
            myConsoleReporter: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ log: '*', error: '*', response: '*', request: '*', ops: '*' }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }

    await server.register(HapiPino)
    await server.register({ register: good, options: goodOptions })
    await server.start()

    console.log('Ocomis User API Service started.')
    console.log(`Server running at: ${server.info.uri}`)
}

provision().catch((error) => {
    console.error(error)
    process.exit(1)
})

module.exports = server // only for testing
