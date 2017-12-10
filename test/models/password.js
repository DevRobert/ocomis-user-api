const lab = exports.lab = require('lab').script()
const { describe, it } = lab
const { expect } = require('code')
const Password = require('../../lib/models/password')

describe('Password', () => {
    describe('checkPassword', () => {
        describe('if the password is valid', () => {
            it('should return true', () => {
                // Arrange

                const password = 'test'
                const passwordHash = Password.generateHash(password)

                console.log('PW: ' + password)
                console.log('PWH: ' + passwordHash)

                // Act

                const result = Password.checkPassword(passwordHash, password)

                // Assert

                expect(result).true()
            })
        })

        describe('if the password is invalid', () => {
            it('should return false', () => {
                // Arrange

                const password = 'test'
                const invalidPassword = 'test2'
                const passwordHash = Password.generateHash(password)

                // Act

                const result = Password.checkPassword(passwordHash, invalidPassword)

                // Assert

                expect(result).false()
            })
        })
    })
})
