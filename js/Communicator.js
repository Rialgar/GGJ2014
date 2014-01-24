define(function() {"use strict";
	var Communicator = function Communicator() {
		this.socket;
	};

	Communicator.prototype.connect = function() {
		var socket = io.connect('http://'+window.location.host);
		var that = this;
		
		socket.on("data", function(data) {
			console.log(data);
		});
		
		this.socket = socket;
	};
	
	Communicator.prototype.send = function(data) {
	  	this.socket.emit("data", data);
	};
	return Communicator;
});