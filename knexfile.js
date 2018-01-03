const Config = require('config')

module.exports = {
    development: {
        client: 'postgresql',
        connection: {
            host: Config.get('database.host'),
            database: Config.get('database.name'),
            user: Config.get('database.user'),
            password: Config.get('database.password')
        }
    }
}
