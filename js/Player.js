define(["Keyboard", "Vector2D", "Sprite", "Communicator", "Gamepad"], function(Keyboard, Vector2D, Sprite, Communicator, Gamepad) {"use strict";
	var Player = function Player() {
		this.position = new Vector2D(8, 5);

		this.LP = 2;
		this.invincible = false;

		this.keyboard = new Keyboard(document);
		this.gamepad = new Gamepad(0);
		this.movingVector = new Vector2D();
		this.externalMovingVector = new Vector2D();

		this.speed = 3;

		this.registerEventHandlers();
		this.refreshLifeDisplay();

		this.game = null;

		var that = this;

		this.sprite = new Sprite("./maps/character.png", 95, 106, new Vector2D(0, 0), 4, {});
		this.sprite.setPosition(this.position);
		Communicator.instance.register(this, "moveChange", function(data) {
			this.position.set(data.pos.x, data.pos.y);
			that.applyExternalMovement(data.vec);
			this.sprite.setPosition(this.position);
		});
	};

	Player.prototype.refreshLifeDisplay = function() {
		var el = document.getElementById("lifeDisplay");
		while (el.firstChild) {
			el.removeChild(el.firstChild);
		}
		for (var i = 0; i < this.LP; i++) {
			var im = document.createElement("img");
			im.setAttribute("src", "./maps/character.png");
			el.appendChild(im);
		}
	};

	Player.prototype.registerEventHandlers = function() {
		this.keyboard.register(this, "moveChange", function(data) {
			this.movingVector = data;
			Communicator.instance.send({
				type : "moveChange",
				val : {
					vec : data,
					pos : this.position
				}
			});
		});
		this.gamepad.register(this, "moveChange", function(data) {
			this.movingVector = data;
			Communicator.instance.send({
				type : "moveChange",
				val : {
					vec : data,
					pos : this.position
				}
			});
		});
	};

	Player.prototype.die = function() {
		var el = document.getElementById("canvas");
		new TWEEN.Tween({
			val : 1,
		}).to({
			val : .0
		}, 500).easing(TWEEN.Easing.Quadratic.Out).onUpdate(function() {
			el.style.opacity = this.val;
		}).start();
	}

	Player.prototype.damage = function() {
		if (!this.invincible) {
			this.LP--;
			this.refreshLifeDisplay();
			this.invincible = true;
			if (this.LP < 0) {
				this.die();
				return;
			}
			var that = this;
			window.setTimeout(function() {
				that.invincible = false;
			}, 2000);
		}
	}

	Player.prototype.update = function(delta) {
		this.gamepad.update();

		var moving = this.movingVector.copy().add(this.externalMovingVector);
		var scaledMoving = moving.multiplied(delta / 1000 * this.speed);

		this.moveColliding(scaledMoving);
	};

	Player.prototype.moveColliding = function(movement) {
		var dx = movement.x;
		this.position.x += dx;
		if (this.game.level.collides(this.position) || this.game.critterCollide(this.position)) {
			this.position.x -= dx;
		}
		var dy = movement.y;
		this.position.y += dy;
		if (this.game.level.collides(this.position) || this.game.critterCollide(this.position)) {
			this.position.y -= dy;
		}
		this.sprite.setPosition(this.position);
	};

	Player.prototype.applyExternalMovement = function(moveDelta) {
		this.externalMovingVector.set(moveDelta.x, moveDelta.y);
	};

	Player.instance = new Player();

	return Player;
}); 