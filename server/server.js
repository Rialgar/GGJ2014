var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , url = require('url');

app.listen(80);

var fileEnding = function(filename) {
	var idx = filename.lastIndexOf(".");
	return filename.substr(idx + 1);
};

var setResponseHeaderByFileEnding = function(ext, response) {
	switch(ext) {
		case 'html':
			response.setHeader("Content-Type", "text/html");
			break;
		case 'css':
			response.setHeader("Content-Type", "text/css");
			break;
		case 'js':
			response.setHeader("Content-Type", "text/javascript");
			break;
		case 'jpg':
			response.setHeader("Content-Type", "image/jpeg");
			break;
		case 'png':
			response.setHeader("Content-Type", "image/png");
			break;
		case 'gif':
			response.setHeader("Content-Type", "image/gif");
			break;
		case 'tmx':
			response.setHeader("Content-Type", "application/xml");
			break;
	}
};



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
	var ext = fileEnding(uri);
	setResponseHeaderByFileEnding(ext, response);

    response.writeHead(200);
    response.end(data);
  });
}

io.sockets.on('connection', function (socket) {
  sockets.push(socket);
  socket.emit("init", sockets.length % 2);
  socket.on("data", function (data) {
    for(var i = 0; i< sockets.length; i++) {
    	if(sockets[i] && sockets[i] !== socket) {
    		sockets[i].emit("data", data);
    	}
    }
  });
});