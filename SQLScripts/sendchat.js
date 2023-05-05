const { pool, sql } = require("./config");

async function StoreChatMessages(receiverid, senderId, chatroom, chatmessage) {
  console.log(param1, "param1");
  console.log(param2, "param2");
  try {
    const request = pool.request();
    request.input("receiverid", sql.VarChar(100), receiverid);
    request.input("senderId", sql.VarChar(100), senderId);
    request.input("chatroom", sql.VarChar(1000), chatroom);
    request.input("chatmessage", sql.VarChar(1000), chatmessage);
    const result = await request.query(
      "insert into receiverID,senderid,Chatroom,ChatMessage " +
        " values (@receiverid, @senderId, @chatroom, @chatmessage)"
    );
    return result.recordset;
  } catch (err) {
    console.error("Error executing MSSQL script:", err);
    throw err;
  }
}

module.exports = StoreChatMessages;
