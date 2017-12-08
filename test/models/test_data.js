const generateSaltAndHash = require('../../lib/models/password').generateSaltAndHash
const DB = require('../../lib/models/DB')
const KnexCleaner = require('knex-cleaner')

async function initializeTestData () {
    await DB.migrate.latest()
    await clearAll()
    await initializeUsers()
}

async function clearAll () {
    await KnexCleaner.clean(DB, {
        mode: 'delete',
        ignoreTables: [
            'knex_migrations',
            'knex_migrations_lock'
        ]
    })
}

async function initializeUsers () {
    let users = [
        { id: 10, name: 'robert', password: 'test' },
        { id: 20, name: 'stefan', password: 'test2' }
    ]

    users.forEach((user) => {
        user.password = generateSaltAndHash(user.password)
    })

    await DB.batchInsert('users', users)
}

module.exports = {
    initializeTestData
}
