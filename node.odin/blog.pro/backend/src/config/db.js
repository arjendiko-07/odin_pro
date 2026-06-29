//creates and manages the connection to your sql server db.
//every other file uses this to run queries
const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER.replace('\\SQLEXPRESS', ''), // IMPORTANT FIX
    database: process.env.DB_NAME,
    options: {
        instanceName: 'SQLEXPRESS', // IMPORTANT FIX
        encrypt: false,
        trustServerCertificate: true,
    },
};

let pool;

async function getPool() {
    if (!pool) {
        pool = await sql.connect(config);

        // DEBUG (REMOVE LATER)
        const info = await pool.request().query(`
            SELECT DB_NAME() AS db, @@SERVERNAME AS server
        `);
        console.log('CONNECTED TO:', info.recordset);
    }

    return pool;
}

module.exports = { getPool, sql };