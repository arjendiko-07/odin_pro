require('dotenv').config();

const sql = require('mssql');

const config = {
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    authentication: {
        type: 'default',
        options: {
            userName: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        }
    },
    options: {
        trustServerCertificate: true,
    }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();
poolConnect.catch(err => console.error('DB connection failed', err));
module.exports = { pool, poolConnect, sql };