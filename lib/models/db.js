const config = require('../../knexfile')
const environment = 'development'
const knex = require('knex')(config[environment])

module.exports = knex
