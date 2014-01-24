define(["Keyboard", "Vector2D"], function(Keyboard, Vector2D) {"use strict";
	var Player = function Player() {
		this.position = new Vector2D();
		this.LP = 3;
		this.controller = new Keyboard(document);
		this.speed = 3;
	};
	
	Player.prototype.update = function(delta) {
		this.position.add(this.controller.movingVector.multiplied(delta/1000*this.speed));
		//console.log(this.position);
	};

	return Player;
});