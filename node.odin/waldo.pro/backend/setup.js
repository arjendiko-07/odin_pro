require('dotenv').config();//load environment variables from the .env file
const { pool, poolConnect, sql } = require('./db');//import the shared db connection pool and slq helper from db.js

async function setup() {
    //waits until the db connection is acctually ready before doing anything
    await poolConnect;

    //characters table
    await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='characters' AND xtype='U')
        CREATE TABLE characters (
            id          INT IDENTITY(1,1) PRIMARY KEY,
            name        NVARCHAR(100) NOT NULL,
            img_url     NVARCHAR(500) NOT NULL,
            x_percent   FLOAT NOT NULL,
            y_percent   FLOAT NOT NULL,
            tolerance   FLOAT NOT NULL DEFAULT 5.0
        )
    `);
    
    //sessions table
    await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='sessions' AND xtype='U')
        CREATE TABLE sessions (
            id           INT IDENTITY(1,1) PRIMARY KEY,
            token        NVARCHAR(100) NOT NULL UNIQUE,
            start_time   DATETIME NOT NULL DEFAULT GETDATE(),
            end_time     DATETIME NULL,
            player_name  NVARCHAR(100) NULL,
            image_url    NVARCHAR(500) NOT NULL,
            found        NVARCHAR(MAX) NOT NULL DEFAULT '[]'
        )
    `);

    console.log('Tables created.');

    
    const imageUrl = 'images/level1.jpg';

    //check if we alredy seeded
    const existing = await pool.request()
        .input('img', sql.NVarChar, imageUrl)//saftey passes a value into the sql query as a parameter(the paramenter name, the type, the value), this prevents sql injection
        .query('SELECT COUNT(*) AS cnt FROM characters WHERE img_url = @img');//how many rows match, if 0 we havent seeded yet, @img is replaced by the value we passed in with .input()

    if (existing.recordset[0].cnt === 0) {
        //recordset is the array of result rows, recordset[0] is the first (and only) row, .cnt is the COUNT(*) value we alised above

        const characters = [
            { name: 'Waldo',  x: 0, y: 0 },  
            { name: 'Wilma',  x: 0, y: 0 },
            { name: 'Wizard', x: 0, y: 0 },
        ];

    for (const c of characters) {//loop throgh each character and insert a row for it
        await pool.request()
            .input('name', sql.NVarChar, c.name) //the charcter`s name
            .input('img',  sql.NVarChar, imageUrl) //which image they`re in
            .input('x',   sql.Float, c.x) //horizontal position (%)
            .input('y',   sql.Float, c.y) //vertical position (%)
            .input('tol', sql.Float, 5.0) //click tolerance in % units
            .query(`
            INSERT INTO characters (name, img_url, x_percent, y_percent, tolerance)
            VALUES (@name, @img, @x, @y, @tol)
            `); //each @name, @img etc. is replaced by the .input() values above 
        }
    console.log('Characters seeded.');
    } else {
        //rows alredy exist for this image -skip inserting to avoid duplicates
    console.log('Characters already exist, skipping seed.');
    }

    console.log('Setup complete!');
    process.exit(0);//exit the script clearly (0=success)
}

//run setup- if anything throws an error, catch it, log it, and exit with code 1
// (1=something went wrong, as opposed to 0=success)
setup().catch(err => {
    console.error('Setup failed:', err);
    process.exit(1);
});