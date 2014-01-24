define(function() {"use strict";
	var Communicator = function Communicator() {
		this.socket;
	};
	
	Communicator.prototype.connect = function() {
		var socket = io.connect('http://'+window.location.host);
		var that = this;
		
		socket.on("data", function(data) {
			//console.log(data);
			//TODO: do something depending on the type of data which is received
		});
		
		this.socket = socket;
	};
	
	Communicator.prototype.send = function(data) {
	  	this.socket.emit("data", data);
	};
	
	Communicator.instance = new Communicator();
	Communicator.instance.connect();
		
	return Communicator;
});