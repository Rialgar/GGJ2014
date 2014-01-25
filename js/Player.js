define(["Keyboard", "Vector2D", "Communicator", "Gamepad"], function(Keyboard, Vector2D, Communicator, Gamepad) {"use strict";
	var Player = function Player() {
		this.position = new Vector2D();
		this.LP = 3;
		this.keyboard = new Keyboard(document);
		this.gamepad = new Gamepad(0);
		this.speed = 3;
		
		var that = this;
		Communicator.instance.register(this, "moveChange", function(data) {
			that.applyExternalMovement(data);
		});
	};
	
	Player.prototype.update = function(delta) {
		this.gamepad.update();
		
		var moving = this.gamepad.ownMovingVector.length() ? this.gamepad.movingVector : this.keyboard.movingVector;
		
		this.position.add(moving.multiplied(delta/1000*this.speed));
	};
	
	Player.prototype.applyExternalMovement = function(moveDelta) {
		this.keyboard.externalMovingVector = new Vector2D(moveDelta.x, moveDelta.y);
		this.keyboard.update();
	};
	
	Player.instance = new Player();

	return Player;
});