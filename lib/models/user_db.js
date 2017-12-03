const DB = require('./db')

async function createUser (user) {
    const result = await DB('users').returning('id').insert(userToRow(user))
    return result[0]
}

async function updateUser (user) {
    throw new Error('Not implemented')
    // return DB('users').update(userToRow(user))
}

async function getAllUsers () {
    throw new Error('Not implemented')
    // return (await DB('users').select('*')).map(rowToUser)
}

async function getUser (userId) {
    const rows = await DB('users').where({id: userId}).select('*')

    if (rows.length === 0) {
        return undefined
    }

    return rowToUser(rows[0])
}

async function getUserByName (userName) {
    const rows = await DB('users').where({name: userName}).select('*')

    if (rows.length === 0) {
        return undefined
    }

    return rowToUser(rows[0])
}

function userToRow (user) {
    return {
        id: user.id,
        name: user.name,
        password_hash: user.passwordHash,
        password_salt: user.passwordSalt
    }
}

function rowToUser (row) {
    return {
        id: row.id,
        name: row.name,
        passwordHash: row.password_hash,
        passwordSalt: row.password_salt
    }
}

module.exports = {
    createUser,
    updateUser,
    getAllUsers,
    getUser,
    getUserByName
}
