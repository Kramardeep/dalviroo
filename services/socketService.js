var io = require('socket.io')();

io.on('connection', function (socket) {
  console.log('a user connected');

  socket.on('update kitchen display', function (data) {
    console.log(data);
  });

  socket.on('status done', function (data) {
    console.log(data);
  });

});



module.exports = io;