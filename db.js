const Pool = require('pg').Pool
require('dotenv').config()    

const pool = new Pool({
    user: process.env.UNAME,    // USERNAME ACTS AS A KEYWORD HENCE UNAME
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.DBPORT,
    database: process.env.DATABASE,
})

module.exports = pool