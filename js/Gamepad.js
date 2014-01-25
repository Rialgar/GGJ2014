define(["Vector2D", "Communicator", "Emitter"], function(Vector2D, Communicator, Emitter) {"use strict";
	var Gamepad = function(id) {
		Emitter.call(this);
		this.id = id;
		this.lastState = null;
		this.currentState = null;
		this.movingVector = new Vector2D();

		this.actionRequest = [];

		this.update();
	};

	Gamepad.prototype = Object.create(Emitter.prototype);
	Gamepad.prototype.constructor = Gamepad;

	Gamepad.prototype.update = function() {
		this.lastState = this.currentState && this.currentState.buttons;
		if (navigator.webkitGetGamepads) {
			this.currentState = navigator.webkitGetGamepads()[this.id];
		}

		if (this.currentState) {
			this.lastVector = this.movingVector.copy();
			this.movingVector.x = this.currentState.buttons[Gamepad.BUTTON_RIGHT] - this.currentState.buttons[Gamepad.BUTTON_LEFT];
			this.movingVector.y = -(this.currentState.buttons[Gamepad.BUTTON_UP] - this.currentState.buttons[Gamepad.BUTTON_DOWN]);
			if (!this.movingVector.length()) {
				this.movingVector.x = Math.abs(this.currentState.axes[0]) > Gamepad.STICK_THRESHOLD ? this.currentState.axes[0] : 0;
				this.movingVector.y = -(Math.abs(this.currentState.axes[1]) > Gamepad.STICK_THRESHOLD ? -this.currentState.axes[1] : 0);
			}

			if (this.lastVector.sub(this.movingVector).length() !== 0) {
				this.emit("moveChange", this.movingVector);
			}

			if (this.lastState) {
				for (var i = 0; i < this.lastState.length; i++) {
					if (this.currentState.buttons[i] && !this.lastState[i]) {
						this.actionRequest[i] = true;
					}
				}
			}
		}
	};
	Gamepad.BUTTON_A = 0;
	Gamepad.BUTTON_B = 1;
	Gamepad.BUTTON_X = 2;
	Gamepad.BUTTON_Y = 3;
	Gamepad.BUTTON_LB = 4;
	Gamepad.BUTTON_RB = 5;
	Gamepad.BUTTON_LT = 6;
	Gamepad.BUTTON_RT = 7;
	Gamepad.BUTTON_SELECT = 8;
	Gamepad.BUTTON_START = 9;
	Gamepad.LEFT_STICK = 10;
	Gamepad.RIGHT_STICK = 11;
	Gamepad.BUTTON_UP = 12;
	Gamepad.BUTTON_DOWN = 13;
	Gamepad.BUTTON_LEFT = 14;
	Gamepad.BUTTON_RIGHT = 15;
	Gamepad.STICK_THRESHOLD = 0.2;

	return Gamepad;
});
