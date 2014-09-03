/**
 * By Baiping.
 */
var express = require('express');
var logger = require('morgan');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// log requests.
app.use(logger('dev'));
// Static resource.
app.use(express.static(__dirname + '/public'));

// index.html
app.get('/', function(req, res){
  res.sendfile('index.html');
});
app.get('/assets/patterns.php', function(req, res){
  res.sendfile('info.json');
});

// msgs which are currently connected to the chat
//var msgs = {};
var numUsers = 0;

// Socket IO.
io.on('connection', function(socket){
  socket.emit('connect');
  // when the client emits 'add user', this listens and executes
  socket.on('join room', function (msg) {
    // we store the msg in the socket session for this client
	console.log('Receiving (join room) event from room: '+msg.room);
    socket.msg = msg.room;
    // add the client's msg to the global list
    ++numUsers;
    addedUser = true;
	//Join the room named 'xxxxx'.
	socket.join(msg.room);
	console.log('Room size: '+io.sockets.sockets.length);
	
    socket.emit('user joined', {
      user_count: numUsers
    });
	
    // echo globally (all clients) that a person has connected
    socket.broadcast.to(msg.room).emit('user joined', {
      //msg: socket.msg,
      user_count: numUsers
    });
  });

  socket.on('webrtc', function (msg) {
    // Broadcast in room 'xxx'
	console.log('Receiving webrtc event from room: '+msg.room);
	socket.broadcast.to(msg.room).emit('webrtc', {data: msg.data});
  });
 
});

server.listen(3000);
console.log('listening on port 3000');

