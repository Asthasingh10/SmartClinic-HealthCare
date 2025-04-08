const mysql=require("mysql2")

const conn=mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"auth_demo",
    password:"1234"
})

conn.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected!');
});

module.exports = conn;
