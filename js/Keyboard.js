define(["Vector2D", "Communicator", "Emitter"], function(Vector2D, Communicator, Emitter) {"use strict";
	var Keyboard = function(target) {
		Emitter.call(this);
		var that = this;
		this.keys = [];
		for (var i = 0; i < 256; i++) {
			this.keys[i] = false;
		}
		this.movingVector = new Vector2D();

		target.addEventListener("keydown", function(evt) {
			if(that.keys[evt.keyCode] !== true) {
				that.keys[evt.keyCode] = true;
				if(Keyboard.moveKeys.indexOf(evt.keyCode) >= 0){
					that.update();
					that.emit("moveChange", that.movingVector);
				} else if (evt.keyCode === Keyboard.KEY_SPACE) {
					that.emit("attack");
				}
			}
			if(evt.keyCode >= 37 && evt.keyCode <= 40 || evt.keyCode >= 48 && evt.keyCode <= 90 || evt.keyCode === 32) {
				evt.preventDefault();
			}
		}, false);
		target.addEventListener("keyup", function(evt) {
			if(that.keys[evt.keyCode] !== false) {
				that.keys[evt.keyCode] = false;
				if(Keyboard.moveKeys.indexOf(evt.keyCode) >= 0){
					that.update();
					that.emit("moveChange", that.movingVector);
				}
			}
			if(evt.keyCode >= 37 && evt.keyCode <= 40 || evt.keyCode >= 48 && evt.keyCode <= 90 || evt.keyCode === 32) {
				evt.preventDefault();
			}		
		}, false);
	};
	Keyboard.prototype = Object.create(Emitter.prototype);
	Keyboard.prototype.constructor = Keyboard;
	
	
	Keyboard.prototype.update = function() {
		this.movingVector.x = this.keys[Keyboard.KEY_D] + this.keys[Keyboard.KEY_RIGHT] - this.keys[Keyboard.KEY_A] - this.keys[Keyboard.KEY_LEFT];
		this.movingVector.y = -(this.keys[Keyboard.KEY_W] + this.keys[Keyboard.KEY_UP] - this.keys[Keyboard.KEY_S] - this.keys[Keyboard.KEY_DOWN]);
		
		this.movingVector.normalize();
	};
	Keyboard.KEY_W = 87;
	Keyboard.KEY_A = 65;
	Keyboard.KEY_S = 83;
	Keyboard.KEY_D = 68;
	Keyboard.KEY_UP = 38;
	Keyboard.KEY_LEFT = 37;
	Keyboard.KEY_DOWN = 40;
	Keyboard.KEY_RIGHT = 39;
	Keyboard.KEY_SPACE = 32;

	Keyboard.moveKeys = [
		Keyboard.KEY_W,
		Keyboard.KEY_A,
		Keyboard.KEY_S,
		Keyboard.KEY_D,
		Keyboard.KEY_UP,
		Keyboard.KEY_LEFT,
		Keyboard.KEY_DOWN,
		Keyboard.KEY_RIGHT
	];

	return Keyboard;
});
