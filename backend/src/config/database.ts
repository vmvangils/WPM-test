import mysql from 'mysql2/promise';
// database connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'typing_test_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool; 