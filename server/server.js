var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , url = require('url');
  

app.listen(80);

var path = "..";

var sockets = [];

function handler (request, response) {
  var req = url.parse(request.url);
  var uri = req.pathname;
  
  if(uri === "/") {
  	uri = "/index.html";
  }
  
  fs.readFile(path + uri,
  function (err, data) {
    if (err) {
      response.writeHead(500);
      return response.end('Error loading file');
    }

    response.writeHead(200);
    response.end(data);
  });
}

io.sockets.on('connection', function (socket) {
  sockets.push(socket);
  
  socket.emit('debug', "hello world");
  
  socket.on("data", function (data) {
    for(var i = 0; i< sockets.length; i++) {
    	if(sockets[i] && sockets[i] !== socket) {
    		sockets[i].emit("data", data);
    	}
    }
  });
});