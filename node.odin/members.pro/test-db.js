const { poolPromise } = require("./db");
//imports the connection promise from db.js, uses destructuring: pulls only poolPromise out of the exported object
async function test() {
    //lets us wait for the data to be passed
    try {
        const pool = await poolPromise;//waits for the database connection to be established 

        const result = await pool.request().query("SELECT 1 AS test");//creates a new query request, runs a simple test and returns row with value 1, to veriffy if its working

        console.log(result.recordset);//results we got as an array
    } catch (err) {
        console.error("DB ERROR:", err);//if it fails print details why.
    }
}

test();