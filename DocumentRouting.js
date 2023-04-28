function NotifyUser(socket,data) {
    socket.to(data.room).emit(data.room,data.message)
}


module.exports = NotifyUser;
