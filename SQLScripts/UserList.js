const { pool } = require("./config");

async function getUsers() {
  try {
    const request = pool.request();
    const result = await request.query("SELECT * FROM Users");
    // console.log(result)
    return result.recordset;
  } catch (err) {
    console.error("Error executing MSSQL  userlistscript:", err);
    throw err;
  }
}

async function getGroups() {
  try {
    const request = pool.request();
    const result = await request.query("SELECT * FROM Groups");
    // console.log(result)
    return result.recordset;
  } catch (err) {
    console.error("Error executing MSSQL  Groupslist script:", err);
    throw err;
  }
}

module.exports = {
  getUsers,
  getGroups,
};
