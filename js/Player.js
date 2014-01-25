define(["Keyboard", "Vector2D", "Communicator", "Gamepad"], function(Keyboard, Vector2D, Communicator, Gamepad) {"use strict";
	var Player = function Player() {
		this.position = new Vector2D();
		this.LP = 3;
		this.keyboard = new Keyboard(document);
		this.gamepad = new Gamepad(0);
		this.speed = 3;
		
		this.level = null;
		
		var that = this;
		Communicator.instance.register(this, "moveChange", function(data) {
			that.applyExternalMovement(data);
		});
	};
	
	Player.prototype.update = function(delta) {
		this.gamepad.update();
		
		var moving = this.gamepad.ownMovingVector.length() ? this.gamepad.movingVector : this.keyboard.movingVector;
		var scaledMoving = moving.multiplied(delta/1000*this.speed);
		
		this.moveColliding(scaledMoving);
	};
	
	Player.prototype.moveColliding = function(movement) {
		var dx = movement.x;
		this.position.x += dx;
		if(this.level.collides(this.position.x, this.position.y)) {
			
		//}
		//if (this.collisionMap.get(Math.round(this.position.x), Math.round(-this.position.y))) {
			this.position.x -= dx;
			console.log("resettet movement");
		}
		var dy = movement.y;
		this.position.y += dy;
		//if (this.collisionMap.get(Math.round(this.position.x), Math.round(-this.position.y))) {
		if(this.level.collides(this.position.x, this.position.y)) {
			this.position.y -= dy;
			console.log("resettet movement");
		}
	};
	
	Player.prototype.applyExternalMovement = function(moveDelta) {
		this.keyboard.externalMovingVector = new Vector2D(moveDelta.x, moveDelta.y);
		this.keyboard.update();
	};
	
	Player.instance = new Player();

	return Player;
});