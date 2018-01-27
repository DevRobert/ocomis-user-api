const lab = exports.lab = require('lab').script()
const { before, beforeEach, describe, it } = lab
const { expect } = require('code')
const TestData = require('../models/test_data')
const Server = require('../../')
const generateToken = require('./generate_token')
const Config = require('config')

const generateAuthCookie = () => {
    const cookieKey = Config.get('jwt.cookieKey')
    const cookieValue = generateToken({ userId: 1, userName: 'robert' })
    return `${cookieKey}=${cookieValue}`
}

describe('UserController', () => {
    before(async () => {
        return new Promise((resolve, reject) => {
            Server.on('start', resolve)
        })
    })

    beforeEach(async () => {
        await TestData.initializeTestData()
    })

    describe('POST /user/api/users', () => {
        describe('if the name and no password is given', () => {
            it('should create the user and return its id', async () => {
                // Act

                const response = await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'POST',
                    url: '/user/api/users',
                    payload: {
                        name: 'sam'
                    }
                })

                // Assert

                expect(response.statusCode).equals(201)
                expect(response.result).instanceOf(Object)
                expect(response.result.id).number().greaterThan(0)
            })
        })

        describe('if the name and a password is given', () => {
            it('should store the password for further credentials checks', async () => {
                // Arrange

                const name = 'sam'
                const password = 'sam-password'

                await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'POST',
                    url: '/user/api/users',
                    payload: {
                        name,
                        password
                    }
                })

                // Act

                const response = await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'POST',
                    url: '/user/api/users/validateCredentials',
                    payload: {
                        name,
                        password
                    }
                })

                // Assert

                expect(response.statusCode).equals(200)
            })
        })

        describe('if the name was not specified', () => {
            it('should return an error response', async () => {
                // Act

                const response = await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'POST',
                    url: '/user/api/users'
                })

                // Assert

                expect(response.statusCode).equals(400)
                expect(response.result).instanceOf(Object)
                expect(response.result.message).equals('The name was not specified.')
            })
        })

        describe('if the name is already used', () => {
            it('should return an error response', async () => {
                // Act

                const response = await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'POST',
                    url: '/user/api/users',
                    payload: {
                        name: 'robert'
                    }
                })

                // Assert

                expect(response.statusCode).equals(400)
                expect(response.result).instanceOf(Object)
                expect(response.result.message).equals('A user with the given name already exists.')
            })
        })

        describe('if the user is not authenticated', () => {
            it('should return an error response', async () => {
                // Act

                const response = await Server.inject({
                    method: 'POST',
                    url: '/user/api/users'
                })

                // Assert

                expect(response.statusCode).equals(401)
            })
        })
    })

    describe('PUT /user/api/users/{userId}', () => {
        describe('if the user id is not a valid number', () => {
            it('should return an error response', async () => {
                // Act

                const response = await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'PUT',
                    url: '/user/api/users/abc'
                })

                // Assert

                expect(response.statusCode).equals(400)
                expect(response.result).instanceOf(Object)
                expect(response.result.message).equals('The given user id is not a valid number.')
            })
        })

        describe('if the user does not exist', () => {
            it('should return an error response', async () => {
                // Act

                const response = await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'PUT',
                    url: '/user/api/users/1'
                })

                // Assert

                expect(response.statusCode).equals(404)
                expect(response.result).instanceOf(Object)
                expect(response.result.message).equals('The user was not found.')
            })
        })

        describe('if no name is given', () => {
            it('should return an error response', async () => {
                // Act

                const response = await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'PUT',
                    url: '/user/api/users/10'
                })

                // Assert

                expect(response.statusCode).equals(400)
                expect(response.result).instanceOf(Object)
                expect(response.result.message).equals('The name was not specified.')
            })
        })

        describe('if the name has not been changed', () => {
            it('should return OK', async () => {
                // Act

                const response = await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'PUT',
                    url: '/user/api/users/10',
                    payload: {
                        name: 'robert'
                    }
                })

                // Assert

                expect(response.statusCode).equals(200)
            })
        })

        describe('if the name has been changed and the new name is still available', () => {
            it('should return OK', async () => {
                // Act

                const response = await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'PUT',
                    url: '/user/api/users/10',
                    payload: {
                        name: 'sam'
                    }
                })

                // Assert

                expect(response.statusCode).equals(200)
            })

            it('should store the new name for further credentials checks', async () => {
                // Arrange

                const userId = 10
                const newName = 'sam'

                await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'PUT',
                    url: `/user/api/users/${userId}`,
                    payload: {
                        name: newName
                    }
                })

                // Act

                const response = await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'POST',
                    url: '/user/api/users/validateCredentials',
                    payload: {
                        name: newName,
                        password: 'test'
                    }
                })

                // Assert

                expect(response.statusCode).equals(200)
                expect(response.result).instanceOf(Object)
                expect(response.result.id).equals(userId)
            })
        })

        describe('if the name has been changed and the new name is already in use', () => {
            it('should return an error response', async () => {
                // Act

                const response = await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'PUT',
                    url: '/user/api/users/10',
                    payload: {
                        name: 'stefan'
                    }
                })

                // Assert

                expect(response.statusCode).equals(400)
                expect(response.result).instanceOf(Object)
                expect(response.result.message).equals('A user with the given name already exists.')
            })
        })

        describe('if the user is not authenticated', () => {
            it('should return an error message', async () => {
                // Act

                const response = await Server.inject({
                    method: 'PUT',
                    url: '/user/api/users/10'
                })

                // Assert

                expect(response.statusCode).equals(401)
            })
        })
    })

    describe('PUT /user/api/users/{userId}/password', () => {
        describe('if the given id is not a valid number', () => {
            it('should return an error response', async () => {
                // Act

                const response = await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'PUT',
                    url: '/user/api/users/abc/password',
                    payload: {
                        password: 'new-passwored'
                    }
                })

                // Assert

                expect(response.statusCode).equals(400)
                expect(response.result).instanceOf(Object)
                expect(response.result.message).equals('The given user id is not a valid number.')
            })
        })

        describe('if the user was not found', () => {
            it('should return an error response', async () => {
                // Act

                const response = await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'PUT',
                    url: '/user/api/users/1/password',
                    payload: {
                        password: 'new-password'
                    }
                })

                // Assert

                expect(response.statusCode).equals(404)
                expect(response.result).instanceOf(Object)
                expect(response.result.message).equals('The user was not found.')
            })
        })

        describe('if the user id is valid and a password is given', () => {
            it('should accept the password', async () => {
                // Act

                const response = await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'PUT',
                    url: '/user/api/users/10/password',
                    payload: {
                        password: 'new-password'
                    }
                })

                // Assert

                expect(response.statusCode).equals(200)
            })

            it('should store the password for further credentials checks', async () => {
                // Arrange

                const newPassword = 'new-password'

                await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'PUT',
                    url: '/user/api/users/10/password',
                    payload: {
                        password: newPassword
                    }
                })

                // Act

                const response = await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'POST',
                    url: '/user/api/users/validateCredentials',
                    payload: {
                        name: 'robert',
                        password: newPassword
                    }
                })

                // Assert

                expect(response.statusCode).equals(200)
            })
        })

        describe('if the user id is valid and no password is given', () => {
            it('should return an error response', async () => {
                // Act

                const response = await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'PUT',
                    url: '/user/api/users/10/password'
                })

                // Assert

                expect(response.statusCode).equals(400)
                expect(response.result).instanceOf(Object)
                expect(response.result.message).equals('The password was not specified.')
            })
        })

        describe('if the user is not authenticated', () => {
            it('should return an error message', async () => {
                // Act

                const response = await Server.inject({
                    method: 'PUT',
                    url: '/user/api/users/10/password'
                })

                // Assert

                expect(response.statusCode).equals(401)
            })
        })
    })

    describe('DELETE /user/api/users/{userId}/password', () => {
        describe('if the user id is not a number', () => {
            it('should return an error response', async () => {
                // Act

                const response = await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'DELETE',
                    url: '/user/api/users/abc/password'
                })

                // Assert

                expect(response.statusCode).equals(400)
                expect(response.result).instanceOf(Object)
                expect(response.result.message).equals('The given user id is not a valid number.')
            })
        })

        describe('if the user was not found', () => {
            it('should return an error response', async () => {
                // Act

                const response = await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'DELETE',
                    url: '/user/api/users/1/password'
                })

                // Assert

                expect(response.statusCode).equals(404)
                expect(response.result).instanceOf(Object)
                expect(response.result.message).equals('The user was not found.')
            })
        })

        describe('if the user id is valid', () => {
            it('should return OK', async () => {
                // Act

                const response = await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'DELETE',
                    url: '/user/api/users/10/password'
                })

                // Assert

                expect(response.statusCode).equals(200)
            })

            it('should clear the password for further credentials checks', async () => {
                // Arrange

                await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'DELETE',
                    url: '/user/api/users/10/password'
                })

                // Act

                const response = await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'POST',
                    url: '/user/api/users/validateCredentials',
                    payload: {
                        name: 'robert',
                        password: 'test'
                    }
                })

                expect(response.statusCode).equals(400)
                expect(response.result).instanceOf(Object)
                expect(response.result.message).equals('No password has been set for the user.')
            })
        })

        describe('if the user is not authenticated', () => {
            it('should not return an authentication error message', async () => {
                // Act

                const response = await Server.inject({
                    method: 'POST',
                    url: '/user/api/users/validateCredentials'
                })

                // Assert

                expect(response.statusCode).not.equals(401)
            })
        })
    })

    describe('POST /user/api/users/validateCredentials', () => {
        describe('if the credentials are valid', () => {
            it('should return the user', async () => {
                // Act

                const response = await Server.inject({
                    method: 'POST',
                    url: '/user/api/users/validateCredentials',
                    payload: {
                        name: 'robert',
                        password: 'test'
                    }
                })

                // Assert

                expect(response.statusCode).equals(200)
                expect(response.result).instanceOf(Object)
                expect(response.result.id).equals(10)
                expect(response.result.name).equals('robert')
                expect(response.result.password).undefined()
            })
        })

        describe('if no username has been specified', () => {
            it('should return an error response', async () => {
                // Act

                const response = await Server.inject({
                    method: 'POST',
                    url: '/user/api/users/validateCredentials',
                    payload: {
                        password: 'test'
                    }
                })

                // Assert

                expect(response.statusCode).equals(400)
                expect(response.result).instanceOf(Object)
                expect(response.result.message).equals('The name was not specified.')
            })
        })

        describe('if no password has been specified', () => {
            it('should return an error response', async () => {
                // Act

                const response = await Server.inject({
                    method: 'POST',
                    url: '/user/api/users/validateCredentials',
                    payload: {
                        name: 'robert'
                    }
                })

                // Assert

                expect(response.statusCode).equals(400)
                expect(response.result).instanceOf(Object)
                expect(response.result.message).equals('The password was not specified.')
            })
        })

        describe('if the user was not found', async () => {
            it('should return an error response', async () => {
                // Act

                const response = await Server.inject({
                    method: 'POST',
                    url: '/user/api/users/validateCredentials',
                    payload: {
                        name: 'wrong-username',
                        password: 'password'
                    }
                })

                // Assert

                expect(response.statusCode).equals(400)
                expect(response.result).instanceOf(Object)
                expect(response.result.message).equals('The user was not found.')
            })
        })

        describe('if the users exists but the password is invalid', () => {
            it('should return an error response', async () => {
                // Act

                const response = await Server.inject({
                    method: 'POST',
                    url: '/user/api/users/validateCredentials',
                    payload: {
                        name: 'robert',
                        password: 'wrong-password'
                    }
                })

                // Arrange

                expect(response.statusCode).equals(400)
                expect(response.result).instanceOf(Object)
                expect(response.result.message).equals('The given password is invalid.')
            })
        })

        describe('if the user exists but no password has been set', () => {
            it('should return an error response', async () => {
                // Act

                const response = await Server.inject({
                    method: 'POST',
                    url: '/user/api/users/validateCredentials',
                    payload: {
                        name: 'bernd',
                        password: 'password'
                    }
                })

                // Assert

                expect(response.statusCode).equals(400)
                expect(response.result).instanceOf(Object)
                expect(response.result.message).equals('No password has been set for the user.')
            })
        })

        describe('if the user exists but the password is invalid', () => {
            it('should return an error response', async () => {
                // Act

                const response = await Server.inject({
                    method: 'POST',
                    url: '/user/api/users/validateCredentials',
                    payload: {
                        name: 'robert',
                        password: 'wrong-password'
                    }
                })

                // Assert

                expect(response.statusCode).equals(400)
                expect(response.result).instanceOf(Object)
                expect(response.result.message).equals('The given password is invalid.')
            })
        })

        describe('if the user is not authenticated', () => {
            it('should not return an authentication error message', async () => {
                // Act

                const response = await Server.inject({
                    method: 'POST',
                    url: '/user/api/users/validateCredentials'
                })

                // Assert

                expect(response.statusCode).not.equals(401)
            })
        })
    })

    describe('GET /user/api/users', () => {
        it('it should return the list of users', async () => {
            // Act

            const response = await Server.inject({
                headers: { 'Cookie': generateAuthCookie() },
                method: 'GET',
                url: '/user/api/users'
            })

            // Assert

            expect(response.statusCode).equals(200)
            expect(response.result).instanceOf(Array)
            expect(response.result.length).equals(3)

            const firstUser = response.result[0]
            expect(firstUser).instanceOf(Object)
            expect(firstUser.id).equals(10)
            expect(firstUser.name).equals('robert')
            expect(firstUser.password).undefined()
        })

        describe('if the user is not authenticated', () => {
            it('should return an error message', async () => {
                // Act

                const response = await Server.inject({
                    method: 'GET',
                    url: '/user/api/users'
                })

                // Assert

                expect(response.statusCode).equals(401)
            })
        })
    })

    describe('GET /user/api/users/{userId}', () => {
        describe('if the user id is valid', () => {
            it('should return the user', async () => {
                // Act

                const response = await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'GET',
                    url: '/user/api/users/10'
                })

                // Assert

                expect(response.statusCode).equals(200)
                expect(response.result).instanceOf(Object)
                expect(response.result.id).equals(10)
                expect(response.result.name).equals('robert')
                expect(response.result.password).undefined()
                expect(response.result.hasPassword).equals(true)
            })
        })

        describe('if the user id is not a valid number', () => {
            it('should return an errror response', async () => {
                // Act

                const response = await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'GET',
                    url: '/user/api/users/abc'
                })

                // Assert

                expect(response.statusCode).equals(400)
                expect(response.result).instanceOf(Object)
                expect(response.result.message).equals('The given user id is not a valid number.')
            })
        })

        describe('if there is no user for the given user id', () => {
            it('should return an error response', async () => {
                // Act

                const response = await Server.inject({
                    headers: { 'Cookie': generateAuthCookie() },
                    method: 'GET',
                    url: '/user/api/users/15'
                })

                // Assert

                expect(response.statusCode).equals(404)
                expect(response.result).instanceOf(Object)
                expect(response.result.message).equals('The user was not found.')
            })
        })

        describe('if the user is not authenticated', () => {
            it('should return an error message', async () => {
                // Act

                const response = await Server.inject({
                    method: 'GET',
                    url: '/user/api/users/15'
                })

                // Assert

                expect(response.statusCode).equals(401)
            })
        })
    })
})
