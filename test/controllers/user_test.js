const lab = exports.lab = require('lab').script()
const { beforeEach, describe, it } = lab
const { expect } = require('code')
const TestData = require('../models/test_data')
const Server = require('../../')

describe('UserController', () => {
    beforeEach(async () => {
        await TestData.initializeTestData()
    })

    describe('POST /users', () => {
        describe('if the input is valid', () => {
            it('should create the user', async () => {
                // Act

                const response = await Server.inject({
                    method: 'POST',
                    url: '/users',
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

        describe('if the input is invalid', () => {
            it('should return an error response', async () => {
                // Act

                const response = await Server.inject({
                    method: 'POST',
                    url: '/users'
                })

                // Assert

                expect(response.statusCode).equals(400)
                expect(response.result).instanceOf(Object)
                expect(response.result.message).equals('The name was not specified.')
            })
        })
    })

    /*
    describe('PUT /users/{userId}', () => {
        describe('if the user id and input is valid', () => {
            it('should update the user', () => {

            })
        })

        describe('if the user id is invalid', () => {
            it('should update the user', () => {

            })
        })

        describe('if the input is invalid', () => {
            it('should return an error', () => {

            })
        })
    })
    */

    describe('POST /users/validateCredentials', () => {
        describe('if the credentials are valid', () => {
            it('should return the user', async () => {
                // Act

                const response = await Server.inject({
                    method: 'POST',
                    url: '/users/validateCredentials',
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
                    url: '/users/validateCredentials',
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
                    url: '/users/validateCredentials',
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
                    url: '/users/validateCredentials',
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
                    url: '/users/validateCredentials',
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
                    url: '/users/validateCredentials',
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
                    url: '/users/validateCredentials',
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
    })

    describe('GET /users', () => {
        it('it should return the list of users', async () => {
            // Act

            const response = await Server.inject({
                method: 'GET',
                url: '/users'
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
    })

    describe('GET /users/{userId}', () => {
        describe('if the user id is valid', () => {
            it('should return the user', async () => {
                // Act

                const response = await Server.inject({
                    method: 'GET',
                    url: '/users/10'
                })

                // Assert

                expect(response.statusCode).equals(200)
                expect(response.result).instanceOf(Object)
                expect(response.result.id).equals(10)
                expect(response.result.name).equals('robert')
                expect(response.result.password).undefined()
            })
        })

        describe('if the user id is not a valid number', () => {
            it('should return an errror response', async () => {
                // Act

                const response = await Server.inject({
                    method: 'GET',
                    url: '/users/abc'
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
                    method: 'GET',
                    url: '/users/15'
                })

                // Assert

                expect(response.statusCode).equals(404)
                expect(response.result).instanceOf(Object)
                expect(response.result.message).equals('The user was not found.')
            })
        })
    })
})
