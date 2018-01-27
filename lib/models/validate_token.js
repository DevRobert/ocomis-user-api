module.exports = (decoded, request, callback) => {
    let isValid = false

    if (decoded.userId) {
        isValid = true
    }

    callback(null, isValid)
}
