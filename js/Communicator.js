define(["Emitter"], function(Emitter) {"use strict";
	var Communicator = function Communicator() {
		Emitter.call(this);
		this.socket;
	};
	
	Communicator.prototype = Object.create(Emitter.prototype);
	Communicator.prototype.constructor = Communicator;
	
	Communicator.prototype.connect = function() {
		var socket = io.connect('http://'+window.location.host);
		var that = this;
		
		socket.on("data", function(data) {
			//console.log(data);
			that.emit(data.type, data.val);
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