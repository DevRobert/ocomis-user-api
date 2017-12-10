const UserDB = require('../models/user_db')
const Boom = require('boom')
const Password = require('../models/password')

async function createUser (request, reply) {
    if (!request.payload || !request.payload.name) {
        throw Boom.badRequest('The name was not specified.')
    }

    const existingUser = await UserDB.getUserByName(request.payload.name)

    if(existingUser) {
        throw Boom.badRequest('There already exists an user with the specified name.')
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
    const name = request.payload.name
    const password = request.payload.password

    if (!name) {
        throw Boom.badRequest('The name was not specified.')
    }

    if (!password) {
        throw Boom.badRequest('The password was not specified.')
    }

    const user = await UserDB.getUserByName(name)

    if (!user) {
        throw Boom.badRequest('The user was not found.')
    }

    if (!user.password) {
        throw Boom.badRequest('No password has been set for the user.')
    }

    if (!Password.checkPassword(user.password, password)) {
        throw Boom.badRequest('The given password is invalid.')
    }

    const responseUser = {
        id: user.id,
        name: user.name
    }

    reply(responseUser)
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

async function getUser (request, reply) {
    const userId = parseInt(request.params.userId)

    if (!userId) {
        throw Boom.badRequest('The given user id is not a valid number.')
    }

    const user = await UserDB.getUser(userId)

    if (!user) {
        throw Boom.notFound('The user was not found.')
    }

    const responseUser = {
        id: user.id,
        name: user.name
    }

    reply(responseUser)
}

module.exports = {
    createUser,
    updateUser,
    validateCredentials,
    getAllUsers,
    getUser
}
