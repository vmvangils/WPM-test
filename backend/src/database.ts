import mysql from 'mysql2/promise';

// dit maakt een connection pool aan voor de MySQL database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'typing_speed_test',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// dit exporteert de database pool voor gebruik in andere bestanden
export const db = pool; 