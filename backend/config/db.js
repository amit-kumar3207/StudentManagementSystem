// Import MySQL Package
const mysql = require("mysql2");

// Create Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL
db.connect((error) => {
  if (error) {
    console.log("Database Connection Failed:", error.message);
    return;
  }

  console.log("MySQL Database Connected Successfully!");
});

// Export Database Connection
module.exports = db;
