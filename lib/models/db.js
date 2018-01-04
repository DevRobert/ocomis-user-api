const config = require('../../knexfile')
const environment = process.env.NODE_ENV

const knex = require('knex')(config[environment])

module.exports = knex
