const UserDB = require('../models/user_db')
const Boom = require('boom')

async function createUser (request, reply) {
    if (!request.payload || !request.payload.name) {
        throw Boom.badRequest('Please enter the name.')
    }

    const user = {
        name: request.payload.name
    }

    const userId = await UserDB.createUser(user)

    const response = {
        id: userId
    }

    reply(response).code(201)
}

async function updateUser (request, reply) {
    reply('updateUser')
}

async function validateCredentials (request, reply) {
    reply('validateCredentials')
}

async function getAllUsers (request, reply) {
    const users = await UserDB.getAllUsers()
    
    const responseUsers = users.map((user) => {
        return {
            id: user.id,
            name: user.name
        }
    })

    reply(responseUsers)
}

function getUser (request, reply) {
    reply('getUser')
}

module.exports = {
    createUser,
    updateUser,
    validateCredentials,
    getAllUsers,
    getUser
}
