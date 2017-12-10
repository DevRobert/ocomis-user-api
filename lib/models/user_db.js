const DB = require('./db')

async function createUser (user) {
    const result = await DB('users').returning('id').insert(userToRow(user))
    return result[0]
}

async function updateUser (user) {
    return DB('users').update(userToRow(user)).where({id: user.id})
}

async function getAllUsers () {
    return (await DB('users').select('*')).map(rowToUser)
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
        password: user.password
    }
}

function rowToUser (row) {
    return {
        id: row.id,
        name: row.name,
        password: row.password
    }
}

module.exports = {
    createUser,
    updateUser,
    getAllUsers,
    getUser,
    getUserByName
}
