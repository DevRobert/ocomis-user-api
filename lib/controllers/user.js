const UserDB = require('../models/user_db')
const Boom = require('boom')
const Password = require('../models/password')

async function requireUser (request) {
    const userId = parseInt(request.params.userId)

    if (!userId) {
        throw Boom.badRequest('The given user id is not a valid number.')
    }

    const user = await UserDB.getUser(userId)

    if (!user) {
        throw Boom.notFound('The user was not found.')
    }

    return user
}

async function createUser (request, reply) {
    if (!request.payload || !request.payload.name) {
        throw Boom.badRequest('The name was not specified.')
    }

    const existingUser = await UserDB.getUserByName(request.payload.name)

    if (existingUser) {
        throw Boom.badRequest('A user with the given name already exists.')
    }

    const user = {
        name: request.payload.name
    }

    if (request.payload.password) {
        user.password = Password.generateHash(request.payload.password)
    }

    const userId = await UserDB.createUser(user)

    const response = {
        id: userId
    }

    reply(response).code(201)
}

async function updateUser (request, reply) {
    const user = await requireUser(request)

    if (!request.payload || !request.payload.name) {
        throw Boom.badRequest('The name was not specified.')
    }

    const existingUser = await UserDB.getUserByName(request.payload.name)

    if (existingUser && existingUser.id !== user.id) {
        throw Boom.badRequest('A user with the given name already exists.')
    }

    user.name = request.payload.name
    await UserDB.updateUser(user)

    reply()
}

async function updateUserPassword (request, reply) {
    const user = await requireUser(request)

    if (!request.payload || !request.payload.password) {
        throw Boom.badRequest('The password was not specified.')
    }

    user.password = Password.generateHash(request.payload.password)
    await UserDB.updateUser(user)

    reply()
}

async function deleteUserPassword (request, reply) {
    const user = await requireUser(request)

    user.password = null

    await UserDB.updateUser(user)

    reply('deleteUserPassword')
}

async function validateCredentials (request, reply) {
    let name
    let password

    if(request.payload) {
        name = request.payload.name
        password = request.payload.password
    }

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
    const user = await requireUser(request)

    const responseUser = {
        id: user.id,
        name: user.name
    }

    reply(responseUser)
}

module.exports = {
    createUser,
    updateUser,
    updateUserPassword,
    deleteUserPassword,
    validateCredentials,
    getAllUsers,
    getUser
}
