const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "Bink0810!",
    host: "localhost",
    port: "5433",
    database: "ledger"
});

module.exports = pool;