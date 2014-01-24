define(["Keyboard"], function(Keyboard) {"use strict";
	var Player = function Player() {
		this.position = {
			x: 0,
			y: 0
		};
		this.LP = 3;
		this.controller = new Keyboard(document);
	};
	
	Player.prototype.update = function(delta) {
		console.log(this.controller.movingVector);
	};

	return Player;
});