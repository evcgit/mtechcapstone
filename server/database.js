const { Pool } = require('pg');
let dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {rejectUnauthorized: false}
};

const pool = new Pool(dbConfig);

module.exports = pool;



