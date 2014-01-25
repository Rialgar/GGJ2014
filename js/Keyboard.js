define(["Vector2D", "Communicator"], function(Vector2D, Communicator) {"use strict";
	var Keyboard = function(target) {
		var that = this;
		this.keys = [];
		for (var i = 0; i < 256; i++) {
			this.keys[i] = false;
		}
		this.ownMovingVector = new Vector2D();
		this.movingVector = new Vector2D();
		this.externalMovingVector = new Vector2D();

		target.addEventListener("keydown", function(evt) {
			if(that.keys[evt.keyCode] !== true) {
				that.keys[evt.keyCode] = true;
				that.update();
				Communicator.instance.send({type: "moveChange", val: that.ownMovingVector});
			}
			if(evt.keyCode >= 37 && evt.keyCode <= 40 || evt.keyCode >= 48 && evt.keyCode <= 90 || evt.keyCode === 32) {
				evt.preventDefault();
			}
		}, false);
		target.addEventListener("keyup", function(evt) {
			if(that.keys[evt.keyCode] !== false) {
				that.keys[evt.keyCode] = false;
				that.update();
				Communicator.instance.send({type: "moveChange", val: that.ownMovingVector});
			}
			if(evt.keyCode >= 37 && evt.keyCode <= 40 || evt.keyCode >= 48 && evt.keyCode <= 90 || evt.keyCode === 32) {
				evt.preventDefault();
			}		
		}, false);
	};
	Keyboard.prototype = {
		constructor : Keyboard,
		update : function() {
			this.ownMovingVector.x = this.keys[Keyboard.KEY_D] + this.keys[Keyboard.KEY_RIGHT] - this.keys[Keyboard.KEY_A] - this.keys[Keyboard.KEY_LEFT];
			this.ownMovingVector.y = -(this.keys[Keyboard.KEY_W] + this.keys[Keyboard.KEY_UP] - this.keys[Keyboard.KEY_S] - this.keys[Keyboard.KEY_DOWN]);
			
			this.ownMovingVector.normalize();
			
			this.movingVector.x = this.ownMovingVector.x + this.externalMovingVector.x;
			this.movingVector.y = this.ownMovingVector.y + this.externalMovingVector.y;
			this.movingVector.normalize();
//			console.log(this.movingVector);
//			console.log(this.externalMovingVector);
			
		}
	};
	Keyboard.KEY_W = 87;
	Keyboard.KEY_A = 65;
	Keyboard.KEY_S = 83;
	Keyboard.KEY_D = 68;
	Keyboard.KEY_UP = 38;
	Keyboard.KEY_LEFT = 37;
	Keyboard.KEY_DOWN = 40;
	Keyboard.KEY_RIGHT = 39;
	return Keyboard;
});
