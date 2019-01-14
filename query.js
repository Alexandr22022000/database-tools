const pg = require('pg');

const database_url = "postgres://postgres:0000@localhost:5432/avatrade_crm",
    QUERY = "SELECT * FROM users",
    PARAMS = undefined;

const pool = pg.Pool({connectionString: database_url});

pool.query(QUERY, PARAMS)
    .then(data => {console.log(data.rows); pool.end();});