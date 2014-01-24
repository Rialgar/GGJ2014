define(["Vector2D"], function(Vector2D) {"use strict";
	var Keyboard = function(target) {
		var that = this;
		this.keys = [];
		for (var i = 0; i < 256; i++) {
			this.keys[i] = false;
		}
		this.movingVector = new Vector2D();

		target.addEventListener("keydown", function(evt) {
			that.keys[evt.keyCode] = true;
			that.update();
		}, false);
		target.addEventListener("keyup", function(evt) {
			that.keys[evt.keyCode] = false;
			that.update();
		}, false);
	};
	Keyboard.prototype = {
		constructor : Keyboard,
		update : function() {
			this.movingVector.x = this.keys[Keyboard.KEY_D] + this.keys[Keyboard.KEY_RIGHT] - this.keys[Keyboard.KEY_A] - this.keys[Keyboard.KEY_LEFT];
			this.movingVector.y = this.keys[Keyboard.KEY_W] + this.keys[Keyboard.KEY_UP] - this.keys[Keyboard.KEY_S] - this.keys[Keyboard.KEY_DOWN];
			this.movingVector.normalize();
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
