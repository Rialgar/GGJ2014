define(["Keyboard", "Vector2D", "Communicator"], function(Keyboard, Vector2D, Communicator) {"use strict";
	var Player = function Player() {
		this.position = new Vector2D();
		this.LP = 3;
		this.controller = new Keyboard(document);
		this.speed = 3;
		
		var that = this;
		Communicator.instance.register(this, "moveChange", function(data) {
			that.applyExternalMovement(data);
		});
	};
	
	Player.prototype.update = function(delta) {
		this.position.add(this.controller.movingVector.multiplied(delta/1000*this.speed));
	};
	
	Player.prototype.applyExternalMovement = function(moveDelta) {
		this.controller.externalMovingVector = new Vector2D(moveDelta.x, moveDelta.y);
		this.controller.update();
	};
	
	Player.instance = new Player();

	return Player;
});