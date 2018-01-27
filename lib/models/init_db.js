const DB = require('./db')
const UserDB = require('./user_db')
const Password = require('./password')
const logger = require('../logger')

async function initDatabase () {
    logger.info('Starting database migration...')
    await DB.migrate.latest()
    logger.info('Database migration finished.')

    logger.info('Checking database contains users...')

    if (!await UserDB.containsUsers()) {
        logger.info('The database does not contain any users.')

        const user = {
            name: 'Administrator',
            password: Password.generateHash('password')
        }

        logger.info('Creating default user...')
        await UserDB.createUser(user)
        logger.info('Default user created. The credentials are: Administrator/ password')
    } else {
        logger.info('The database contains users.')
    }
}

module.exports = initDatabase
