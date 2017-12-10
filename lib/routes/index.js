const UserController = require('../controllers/user')

const Routes = [
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
    },
    {
        method: 'GET',
        path: '/users',
        handler: UserController.getAllUsers
    },
    {
        method: 'GET',
        path: '/users/{userId}',
        handler: UserController.getUser
    }
]

module.exports = Routes
