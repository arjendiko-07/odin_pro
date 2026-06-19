require("dotenv").config();

const sql = require("mssql");

const config = {
    server: "localhost\\SQLEXPRESS",
    database: "membersdb",

    options: {
        trustServerCertificate: true,
        enableArithAbort: true,
    },

    authentication: {
        type: "default",
        options: {
            userName: "sa",
            password: "star7",
        },
    },
};

const poolPromise = sql.connect(config);

module.exports = {
    sql,
    poolPromise,
};