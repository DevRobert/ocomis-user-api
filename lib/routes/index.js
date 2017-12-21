const UserController = require('../controllers/user')

const Routes = [
    {
        method: 'POST',
        path: '/user/api/users',
        handler: UserController.createUser
    },
    {
        method: 'PUT',
        path: '/user/api/users/{userId}',
        handler: UserController.updateUser
    },
    {
        method: 'POST',
        path: '/user/api/users/validateCredentials',
        handler: UserController.validateCredentials
    },
    {
        method: 'GET',
        path: '/user/api/users',
        handler: UserController.getAllUsers
    },
    {
        method: 'GET',
        path: '/user/api/users/{userId}',
        handler: UserController.getUser
    },
    {
        method: 'PUT',
        path: '/user/api/users/{userId}/password',
        handler: UserController.updateUserPassword
    },
    {
        method: 'DELETE',
        path: '/user/api/users/{userId}/password',
        handler: UserController.deleteUserPassword
    }
]

module.exports = Routes
