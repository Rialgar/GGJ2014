define(function() {"use strict";
	var Communicator = function Communicator() {
		this.socket;
	};
	Communicator.prototype = Object.create(Emitter.prototype);
	Communicator.prototype.constructor = Communicator;

	Communicator.prototype.connect = function() {
		var socket = IO.connect('http://'+window.location.host);
		var that = this;
		
		socket.on("debug", function(data) {
			console.log(data);
		});
		
		this.socket = socket;
	};
	
	Communicator.prototype.send = function(data) {
	  	this.socket.emit("data", data);
	};
	return Communicator;
});