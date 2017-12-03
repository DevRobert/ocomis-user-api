const Hapi = require('hapi')
const Routes = require('./lib/routes')

const server = new Hapi.Server()

server.connection({
    port: 3002
})

server.route(Routes)

server.start((error) => {
    if (error) {
        throw error
    }

    console.log(`Server running at: ${server.info.uri}`)
})
