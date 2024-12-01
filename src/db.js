const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'ecommerce',
    password: '' 
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MariaDB!');
});

module.exports = db;
