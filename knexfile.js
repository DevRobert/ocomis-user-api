const Config = require('config')

const options = {
    client: 'postgresql',
    connection: {
        host: Config.get('database.host'),
        database: Config.get('database.name'),
        user: Config.get('database.user'),
        password: Config.get('database.password'),
        port: Config.get('database.port')
    }
}

module.exports = {
    test: options,
    prod: options
}
