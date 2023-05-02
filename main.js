let express = require("express");
let app = express();

let http = require("http");
let server = http.Server(app);

let socketIO = require("socket.io");
let io = socketIO(server, {
  cors: {
    origin: "*",
  },
});

const myFunction = require("./SocketScripts/privatechat");
const notifyuser = require("./SocketScripts/DocumentRouting");

const UpdateStatus = require("./SQLScripts/UpdateOnline");
const { getUsers, getGroups } = require("./SQLScripts/UserList");
const myFunctions = require("./SocketScripts/myFunctions");
const port = process.env.PORT || 3000;
io.on("connection", (socket) => {
  const token = socket.handshake.headers["token"];

  try {
    getUsers()
      .then((result) => {
        socket.emit("userList", result);
      })
      .catch((error) => {
        console.error("Error calling async function:", error);
      });
  } catch (err) {
    socket.emit("error", err);
  }

  try {
    getGroups()
      .then((result) => {
        socket.emit("groupList", result);
      })
      .catch((error) => {
        console.error("Error calling async function:", error);
      });
  } catch (err) {
    socket.emit("error", err);
  }

  socket.on("online", async () => {
    try {
      const resultonline = await getUsers();
      let obj = resultonline.find((o, i) => {
        if (o.UserLogin === token) {
          return resultonline[i];
        }
      });
      io.emit("online", obj.UserLogin);
      await UpdateStatus(1, token);
    } catch (err) {
      socket.emit("error", err);
    }
  });

  socket.on("disconnect", async () => {
    try {
      const resultonline = await getUsers();
      console.log("someone dc");
      let obj = resultonline.find((o, i) => {
        if (o.UserLogin === token) {
          return resultonline[i];
        }
      });
      io.emit("offline", obj.UserLogin);
      await UpdateStatus(0, token);
    } catch (err) {
      socket.emit("error", err);
    }
  });

  socket.on("leave", (data) => {
    try {
      console.log("[socket]", "leave room :", data);
      socket.leave(data.room);
      socket.in(data.room).emit("new message", data.user);
    } catch (e) {
      console.log("[error]", "leave room :", e);
      socket.emit("error", "couldnt perform requested action");
    }
  });
});

server.listen(port, () => {
  console.log(`started on port: ${port}`);
});
