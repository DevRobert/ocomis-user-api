const UserController = require('../controllers/user')

const Routes = [
    {
        method: 'GET',
        path: '/users',
        handler: UserController.getAllUsers
    },
    {
        method: 'GET',
        path: '/users/{userId}',
        handler: UserController.getUser
    },
    {
        method: 'POST',
        path: '/users',
        handler: UserController.createUser
    },
    {
        method: 'PUT',
        path: '/users',
        handler: UserController.updateUser
    },
    {
        method: 'POST',
        path: '/users/validateCredentials',
        handler: UserController.validateCredentials
    }
]

module.exports = Routes
