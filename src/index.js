const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const port = 3000
const publicDirectoryPath = path.join(__dirname, '../public')
const io = socketio(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});
app.use(express.static(publicDirectoryPath))
const Filter = require('bad-words')
// let count=0;
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
app.get('/', (req, res) => {
  console.log('I ma here')
  res.send('Hello World!')
})
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.get('/login',(req,res)=>{
  res.send(true);
})

io.on('connection', (socket) => {

  socket.on('disconnect', () => {
    const user=removeUser(socket.id);
    console.log(socket.id,user)
    if(user){
      io.to(user.room).emit('clientMessage',  {...user,...generateMessage(user.username +' user has left the room '+user.room)})
      io.to(user.room).emit('roomData',  {room:user.room,users:getUsersInRoom(user.room)});

    }
  })
  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room })
    if (error) {
      return callback(error)
    }
    console.log(socket.id,user)
    socket.join(user.room);

    socket.to(user.room).emit('clientMessage',  {...user,...generateMessage('Welcome to sever')});
    socket.broadcast.to(user.room).emit('clientMessage', {...user,...generateMessage(user.username + ' joined the ' + user.room)});
    io.to(user.room).emit('roomData',  {room:user.room,users:getUsersInRoom(user.room)});
    callback()
  })
  socket.on('clientMessage', (message, callback) => {
    console.log('server', 'message from client', message);
    const filter = new Filter()
    if (filter.isProfane(message)) {
      return callback('bad-words');
    }
    const user=getUser(socket.id)
    if(user){
      io.to(user.room).emit('clientMessage',{...user ,...generateMessage(message,user)})
      callback('success');
  
    }

  })
  socket.on('location', (location, callback) => {
    const user=getUser(socket.id)
if(user){
  io.to(user.room).emit('location', {...user ,...generateLocationMessage(location)})
  callback();

}
  })
})
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})