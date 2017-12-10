const lab = exports.lab = require('lab').script()
const { beforeEach, describe, it } = lab
const { expect } = require('code')
const uuid = require('uuid')
const TestData = require('./test_data')

const UserDB = require('../../lib/models/user_db')

const generateName = () => {
    let name = 'UnitTestUser-'
    name += uuid.v4()
    return name
}

describe('UserDB', () => {
    beforeEach(async () => {
        await TestData.initializeTestData()
    })

    describe('createUser', () => {
        it('should create an user and return its id', async () => {
            // Arrange

            const user = {
                name: generateName()
            }

            // Act

            const userId = await UserDB.createUser(user)

            // Assert

            expect(typeof userId).to.equal('number')
        })
    })

    describe('getUser', () => {
        it('should return the user for a valid id', async () => {
            // Arrange

            const user = {
                name: generateName()
            }

            const userId = await UserDB.createUser(user)

            // Act

            const userFromDatabase = await UserDB.getUser(userId)

            // Assert

            expect(typeof userFromDatabase).to.equal('object')
            expect(userFromDatabase.name).to.equal(user.name)
            expect(userFromDatabase.id).to.equal(userId)
        })

        it('should return undefined for an invalid user id', async () => {
            // Act

            const user = await UserDB.getUser(0)

            // Assert

            expect(typeof user).to.equal('undefined')
        })
    })

    describe('getUserByName', () => {
        it('should return the user for a valid name', async () => {
            // Arrange

            const user = {
                name: generateName()
            }

            const userId = await UserDB.createUser(user)

            // Act

            const userFromDatabase = await UserDB.getUserByName(user.name)

            // Assert

            expect(typeof userFromDatabase).to.equal('object')
            expect(userFromDatabase.name).to.equal(user.name)
            expect(userFromDatabase.id).to.equal(userId)
        })

        it('should return undefined for an invalid name', async () => {
            // Arrange

            const userName = generateName()

            // Act

            const userFromDatabase = await UserDB.getUserByName(userName)

            // Assert

            expect(typeof userFromDatabase).to.equal('undefined')
        })
    })
})
