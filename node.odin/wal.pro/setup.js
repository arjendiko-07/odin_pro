require('dotenv').config();
const { pool, poolConnect, sql } = require('./db');

async function setup() {
    await poolConnect;

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

    // this must match the src path your frontend will use to display the image
    // since index.html is served from /public, and the image is at /public/images/level1.jpg
    // the browser will request it as "images/level1.jpg"
    const imageUrl = 'images/level1.jpg';

    const existing = await pool.request()
        .input('img', sql.NVarChar, imageUrl)
        .query('SELECT COUNT(*) AS cnt FROM characters WHERE img_url = @img');

    if (existing.recordset[0].cnt === 0) {

        const characters = [
            // Waldo: center of image, waving, red/white stripes + bobble hat
            { name: 'Waldo',  x: 52, y: 38 },
            // Wilma: top-left, red/white stripes with bow
            { name: 'Wilma',  x: 12, y: 10 },
            // Wizard: bottom-right, white beard + red robes
            { name: 'Wizard', x: 88, y: 82 },
        ];

        for (const c of characters) {
            await pool.request()
                .input('name', sql.NVarChar, c.name)
                .input('img',  sql.NVarChar, imageUrl)
                .input('x',   sql.Float, c.x)
                .input('y',   sql.Float, c.y)
                .input('tol', sql.Float, 5.0)
                .query(`
                    INSERT INTO characters (name, img_url, x_percent, y_percent, tolerance)
                    VALUES (@name, @img, @x, @y, @tol)
                `);
        }
        console.log('Characters seeded.');
    } else {
        console.log('Characters already exist, skipping seed.');
    }

    console.log('Setup complete!');
    process.exit(0);
}

setup().catch(err => {
    console.error('Setup failed:', err);
    process.exit(1);
});