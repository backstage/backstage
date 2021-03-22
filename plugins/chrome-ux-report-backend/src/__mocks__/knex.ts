const knex = require('jest-mock-knex');
const client = require('jest-mock-knex');
const db = {
    knex,
    client
}
export default db;

process.setMaxListeners(0);
