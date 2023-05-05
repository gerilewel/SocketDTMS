const { pool, sql } = require("./config");

async function UpdateOnline() {
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

async function UpdateOnlineStatus(param1, param2) {
  console.log(param1, "param1");
  console.log(param2, "param2");
  try {
    const request = pool.request();
    request.input("param1", sql.Bit, param1);
    request.input("param2", sql.VarChar(50), param2);
    const result = await request.query(
      "Update Users Set Online = @param1 WHERE userlogin =  @param2"
    );
    return result.recordset;
  } catch (err) {
    console.error("Error executing MSSQL script:", err);
    throw err;
  }
}

module.exports = UpdateOnlineStatus;
