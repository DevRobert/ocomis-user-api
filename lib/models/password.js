const bcrypt = require('bcrypt')

function generateHash (password) {
    const salt = bcrypt.genSaltSync()
    return bcrypt.hashSync(password, salt)
}

function checkPassword (passwordHash, passwordCandiate) {
    return bcrypt.compareSync(passwordCandiate, passwordHash)
}

module.exports = {
    generateHash,
    checkPassword
}
