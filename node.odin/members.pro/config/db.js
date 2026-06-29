require("dotenv").config();
const sql = require("mssql");

const config = {
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_DATABASE,

    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

    options: {
        trustServerCertificate: true,
        enableArithAbort: true,
    },
};

const poolPromise = sql.connect(config);

module.exports = {
    sql,
    poolPromise,
};