const sql = require("mssql");

const config = {
  user: "sa",
  password: "testsa123",
  server: "localhost\\SQLEXPRESS",
  database: "napolcomdtmsdb",
  trustServerCertificate: true,
};

users = [];
group = [];

const pool = new sql.ConnectionPool(config);

pool.connect((err) => {
  if (err) {
    console.error("Error connecting to SQL Server:", err);
  } else {
    console.log("Connected to SQL Server.");
  }
});

module.exports = {
  pool,
  sql,
};
