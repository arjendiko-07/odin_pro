//load environment variables from .env
require('dotenv').config();

const sql=require('mssql');

//conects setting for SQL server
const config={
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        trustedConnection: process.env.DB_TRUSTED=='true',//windows authentications(no password needed)
        trustServerCertificate: true,
    }
};

//this pool is shared accros all routes-one conection, reused everywhere
const pool=new sql.ConnectionPool(config);
const poolConnect=pool.connect();
poolConnect.catch(err=>console.error('DB connection failed', err));
module.exports={pool, poolConnect, sql};