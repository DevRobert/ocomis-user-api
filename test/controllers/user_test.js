const lab = exports.lab = require('lab').script()
const { beforeEach, describe, it } = lab
const { expect } = require('code')
const TestData = require('../models/test_data')
const Server = require('../../')

describe('user controller', () => {
    beforeEach(async () => {
        await TestData.initializeTestData()
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
            expect(response.result.length).equals(2)

            const firstUser = response.result[0]
            expect(firstUser).instanceOf(Object)
            expect(firstUser.id).equals(10)
            expect(firstUser.name).equals('robert')
            expect(firstUser.password).undefined()
        })
    })

    describe('POST /users', () => {
        describe('if the input is valid', () => {
            it('should create the user', async () => {
                // Act

                const response = await Server.inject({
                    method: 'POST',
                    url: '/users',
                    payload: {
                        name: 'bernd'
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
                expect(response.result.message).equals('Please enter the name.')
            })
        })
    })

    describe('PUT /users/:userId', () => {
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

    describe('GET /users/:userId', () => {
        describe('if the user id is valid', () => {
            it('should return the user', () => {
                throw new Error('test')
            })
        })

        describe('if the user id is not valid', () => {
            it('should return an errror response', () => {

            })
        })
    })

    describe('DELETE /users/:userId', () => {
        describe('if the user id is valid', () => {
            it('should delete the user', () => {

            })
        })

        describe('if the user id is not valid', () => {
            it('should return an error response', () => {

            })
        })
    })
})
