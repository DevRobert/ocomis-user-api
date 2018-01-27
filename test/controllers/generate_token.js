const JsonWebToken = require('jsonwebtoken')
const Config = require('config')

module.exports = (tokenData, userName) => {
    const tokenSecret = Config.get('jwt.secret')

    const signOptions = {
        expiresIn: '1h'
    }

    return JsonWebToken.sign(tokenData, tokenSecret, signOptions)
}
