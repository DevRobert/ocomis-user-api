const bcrypt = require('bcrypt')

function generateSaltAndHash (password) {
    const salt = bcrypt.genSaltSync()
    const hash = bcrypt.hashSync(password, salt)

    return {
        salt,
        hash
    }
}

module.exports = {
    generateSaltAndHash
}
