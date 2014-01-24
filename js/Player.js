define(["Keyboard", "Vector2D", "Communicator"], function(Keyboard, Vector2D, Communicator) {"use strict";
	var Player = function Player() {
		this.position = new Vector2D();
		this.LP = 3;
		this.controller = new Keyboard(document);
		this.speed = 3;
	};
	
	Player.prototype.update = function(delta) {
		this.position.add(this.controller.movingVector.multiplied(delta/1000*this.speed));
		//console.log(this.position);
		Communicator.instance.send({type: "position", val: this.position});
	};

	return Player;
});