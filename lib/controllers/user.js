function createUser (request, reply) {
    reply('createUser')
}

function updateUser (request, reply) {
    reply('updateUser')
}

function validateCredentials (request, reply) {
    reply('validateCredentials')
}

function getAllUsers (request, reply) {
    reply('getAllUsers')
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
