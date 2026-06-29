console.log('File started');

require('dotenv').config();

console.log('Dotenv loaded');

const bcrypt = require('bcryptjs');

console.log('bcrypt loaded');

const { getPool, sql } = require('./src/config/db');

console.log('db imported');
async function seed() {
    console.log('Starting seed...');

    const pool = await getPool();
    console.log('Connected to database');

    const hashedPassword = await bcrypt.hash('sun7', 10);

    const result = await pool.request()
        .input('username', sql.NVarChar, 'admin')
        .input('password', sql.NVarChar, hashedPassword)
        .input('is_author', sql.Bit, 1)
        .query(`
            INSERT INTO users (username, password, is_author)
            VALUES (@username, @password, @is_author)
        `);

    console.log('Insert successful');
    console.log(result);

    process.exit();
}