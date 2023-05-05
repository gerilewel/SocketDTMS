const { pool, sql } = require("./config");

async function retrievechats(chatroom) {
  try {
    const request = pool.request();

    request.input("chatroom", sql.VarChar(1000), chatroom);

    const result = await request.query(
      "slect receiverID,senderid,Chatroom,ChatMessage,timestamp " +
        " from chatrooms where chatroom=@chatroom"
    );
    return result.recordset;
  } catch (err) {
    console.error("Error executing MSSQL script:", err);
    throw err;
  }
}

module.exports = retrievechats;
