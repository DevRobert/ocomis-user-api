const Hapi = require('hapi')
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

    server.register({ register: good, options: goodOptions }, (error) => {
        if (error) {
            return console.error(error)
        }

        server.start((error) => {
            if (error) {
                return console.error(error)
            }

            console.log(`Server running at: ${server.info.uri}`)
        })
    })
}

provision()

module.exports = server // only for testing
