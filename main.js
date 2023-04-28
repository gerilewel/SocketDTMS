let express = require('express');
let app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server,{
    cors: {
      origin: "*"
    },
  } );
  
  const sql = require('mssql');
  const myFunction = require('./privatechat');
  const notifyuser = require('./DocumentRouting');

  const config = {
    user: 'sa',
    password: 'testsa123',
    server: 'localhost\\SQLEXPRESS',
    database: 'napolcomdtmsdb',
    trustServerCertificate: true
  };

  users = [];
  group = [];
  sql.connect(config, (err) => {
    if (err) {
      console.error('Failed to connect to MSSQL:', err);
    } else {
      console.log('Connected to MSSQL');
      const query = `SELECT * FROM Users`;
    const request = new sql.Request();
    request.query(query, (err, result) => {
      if (err) {
    //    console.error('Failed to fetch data:', err);
      } else {
        // Emit the query result back to the client
        users = result.recordset
     //   console.log('dataFetched', result.recordset);
      }
    });

    const gquery = `SELECT * FROM Groups`;
    const grequest = new sql.Request();
    grequest.query(gquery, (err, result) => {
      if (err) {
    //    console.error('Failed to fetch data:', err);
      } else {
        // Emit the query result back to the client
        group = result.recordset
     //   console.log('dataFetched', result.recordset);
      }
    });


    }
    
  });
const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
  //console.log(socket.handshake.headers,"hakdof")
  const token = socket.handshake.headers['token'];
//  const token = socket.handshake.auth.token;
console.log(token,"token")
    // allroomsdata =   io.sockets.adapter.rooms
    //  io.emit('rooms', {allroomsdata})
   // console.log(socket)
     console.log("user connected")
     io.emit('users', users)
     io.emit('groups', group)

     socket.on('online', (data) => {
        console.log('pumasok')
        let obj = users.find((o, i) => {
            if (o.UserLogin === "JRT") {
                 
                return users[i]; // stop searching
            }
        });
        io.emit('online',obj.UserLogin)
     } )

     socket.on('disconnect', (data) => {
        console.log('na dc na po siya')
        let obj = users.find((o, i) => {
            if (o.UserLogin === "JRT") {
                 
                return users[i]; // stop searching
            }
        });
        io.emit('offline',obj.UserLogin)
     } )

     socket.on("privatechat",(data) => {
      myFunction.privatechat(socket,data)
     })

     socket.on("DocumentRoutedToMe", (data) => {
      notifyuser(socket,data)
     } )


    socket.on('joinMainRoom', (data) => {
        socket.join(data.room);
        myFunction(io,data)
      //  io.sockets.in(data.room).emit('new message',   {user: data.name, room:data.room, message: "User "+ data.name   + " has joined"});
       // console.log(data,data.name + " has joined")
    });

    socket.on('joinMainRoom', (data) => {
      socket.join(data);
     // io.sockets.in(data.room).emit('new message',   {user: data.name, room:data.room, message: "User "+ data.name   + " has joined"});
      console.log(" has joined:" ,data)
  });

    // socket.on('messageRoom')

    socket.on('message', (data) => {
        console.log(data, 'new message')
        io.in(data.room).emit('new message', {user: data.user,  room:data.room, message: data.message});
    });

    // socket.on('rooms', (data) => {
    //     var rooms = Array.from(socket.rooms);
    //     console.log(rooms, 'rooms');
    //     io.emit('roomlist', String(rooms));
       
    // });

    socket.on('leave',(data) => { 
        try{
          console.log('[socket]','leave room :', data);
          socket.leave(data.room);
          socket.in(data.room).emit('new message', data.user);
        }catch(e){
          console.log('[error]','leave room :', e);
          socket.emit('error','couldnt perform requested action');
        }
      })
});



server.listen(port, () => {
    console.log(`started on port: ${port}`);
});