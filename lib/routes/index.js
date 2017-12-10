const UserController = require('../controllers/user')

const Routes = [
    {
        method: 'POST',
        path: '/users',
        handler: UserController.createUser
    },
    {
        method: 'PUT',
        path: '/users/{userId}',
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
    },
    {
        method: 'PUT',
        path: '/users/{userId}/password',
        handler: UserController.updateUserPassword
    },
    {
        method: 'DELETE',
        path: '/users/{userId}/password',
        handler: UserController.deleteUserPassword
    }
]

module.exports = Routes
