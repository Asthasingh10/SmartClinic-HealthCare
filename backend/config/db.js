require('dotenv').config();

const mysql = require('mysql');

const conn = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});

conn.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Database!');
});

module.exports = conn;
