define(["Vector2D", "Communicator"], function(Vector2D, Communicator) {"use strict";
	var Gamepad = function(id) {
		this.id = id;
		this.lastState = null;
		this.currentState = null;
		this.ownMovingVector = new Vector2D();
		this.movingVector = new Vector2D();
		this.externalMovingVector = new Vector2D();

		this.actionRequest = [];
		window.addEventListener("MozGamepadAxisMove", function(event, pressed) {
			console.log(event);
		}, false);
		this.update();
	};
	Gamepad.prototype = {
		constructor : Gamepad,
		update : function() {
			this.lastState = this.currentState && this.currentState.buttons;
			if (navigator.webkitGetGamepads) {
				this.currentState = navigator.webkitGetGamepads()[this.id];
			} else {

			}

			if (this.currentState) {
				this.lastVector = this.ownMovingVector.copy();
				this.ownMovingVector.x = this.currentState.buttons[Gamepad.BUTTON_RIGHT] - this.currentState.buttons[Gamepad.BUTTON_LEFT];
				this.ownMovingVector.y = -(this.currentState.buttons[Gamepad.BUTTON_UP] - this.currentState.buttons[Gamepad.BUTTON_DOWN]);
				if (!this.ownMovingVector.length()) {
					this.ownMovingVector.x = Math.abs(this.currentState.axes[0]) > Gamepad.STICK_THRESHOLD ? this.currentState.axes[0] : 0;
					this.ownMovingVector.y = -(Math.abs(this.currentState.axes[1]) > Gamepad.STICK_THRESHOLD ? -this.currentState.axes[1] : 0);
				}
				
				this.movingVector.x = this.ownMovingVector.x + this.externalMovingVector.x;
				this.movingVector.y = this.ownMovingVector.y + this.externalMovingVector.y;

				if(this.lastVector.sub(this.ownMovingVector).length() !== 0) {
					Communicator.instance.send({type: "moveChange", val: this.ownMovingVector});
				}
				
				if (this.lastState) {
					for (var i = 0; i < this.lastState.length; i++) {
						if (this.currentState.buttons[i] && !this.lastState[i]) {
							this.actionRequest[i] = true;
						}
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
