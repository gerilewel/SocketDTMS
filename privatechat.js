
function greetperson(io,data) {
    io.sockets.in(data.room).emit('new message',   {user: data.name, room:data.room, message: "User "+ data.name   + " has joined"});
}

function privatechat(socket,data) {
    
}

module.exports = greetperson;
