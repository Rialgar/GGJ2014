define(["Keyboard", "Vector2D", "Communicator", "Gamepad"], function(Keyboard, Vector2D, Communicator, Gamepad) {"use strict";
	var Player = function Player() {
		this.position = new Vector2D();
		this.LP = 3;
		this.keyboard = new Keyboard(document);
		this.gamepad = new Gamepad(0);
		this.movingVector = new Vector2D();
		this.externalMovingVector = new Vector2D();
		
		this.speed = 3;
		
		this.registerEventHandlers();
		
		this.level = null;
		
		var that = this;
		Communicator.instance.register(this, "moveChange", function(data) {
			that.applyExternalMovement(data);
		});
	};
	
	Player.prototype.registerEventHandlers = function() {
		this.keyboard.register(this, "moveChange", function(data) {
			this.movingVector = data;
		});
		this.gamepad.register(this, "moveChange", function(data) {
			this.movingVector = data;
		});
	};
	
	Player.prototype.update = function(delta) {
		this.gamepad.update();
		
		var moving = this.movingVector.copy().add(this.externalMovingVector);
		var scaledMoving = moving.multiplied(delta/1000*this.speed);
		
		this.moveColliding(scaledMoving);
	};
	
	Player.prototype.moveColliding = function(movement) {
		var dx = movement.x;
		this.position.x += dx;
		if(this.level.collides(this.position.x, this.position.y)) {
			this.position.x -= dx;
		}
		var dy = movement.y;
		this.position.y += dy;
		if(this.level.collides(this.position.x, this.position.y)) {
			this.position.y -= dy;
		}
	};
	
	Player.prototype.draw = function(ctx) {
		//TODO: implement
	}
	
	Player.prototype.applyExternalMovement = function(moveDelta) {
		this.externalMovingVector.set(moveDelta.x, moveDelta.y);
	};
	
	Player.instance = new Player();

	return Player;
});