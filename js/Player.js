define(["Keyboard", "Vector2D", "Sprite", "Communicator", "Gamepad"], function(Keyboard, Vector2D, Sprite, Communicator, Gamepad) {"use strict";
	var Player = function Player() {
		this.position = new Vector2D(27, 198);

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

		this.sprite = new Sprite("./maps/kastanieSheet.png", 128, 128, 1, 5, new Vector2D(0, 0), 4, {
			"idle": [{x:0, y:0, time:1000}],
			"up": [{x:1, y:0, time:600}],
			"down": [{x:2, y:0, time:600}],
			"left": [{x:3, y:0, time:600}],
			"right": [{x:4, y:0, time:600}]
		});
		this.sprite.setPosition(this.position);
		Communicator.instance.register(this, "moveChange", function(data) {
			this.position.set(data.pos.x, data.pos.y);
			that.applyExternalMovement(data.vec);
			this.sprite.setPosition(this.position);
		});
		Communicator.instance.register(this, "attack", function(dir) {
			this.doAttack(dir);
		});
		Communicator.instance.register(this, "damage", function(data) {
			this.LP = data+1;
			this.damage();
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
		this.keyboard.register(this, "attack", function() {
			this.attack();
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
		this.gamepad.register(this, "attack", function() {
			this.attack();
		});
		
	};

	Player.prototype.doAttack = function(dir) {
		this.sprite.setAnimation(dir);
	}

	Player.prototype.attack = function() {
		var moving = this.movingVector.copy().add(this.externalMovingVector);
		if(moving.lengthSq() === 0){
			moving = this.lastMoving || new Vector2D(1, 0);
		};
		var dir;
		if(Math.abs(moving.x) >= Math.abs(moving.y)){
			if(moving.x >= 0){
				dir = "right";
			} else {
				dir = "left";
			}
		} else if(moving.y >= 0){
			dir = "down";
		} else {
			dir = "up";
		}
		Communicator.instance.send({
			type: "attack",
			val: dir
		});
		this.doAttack(dir);
	}

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

		if(moving.lengthSq() > 0){
			this.lastMoving = moving;
		}

		var scaledMoving = moving.multiplied(delta / 1000 * this.speed);

		this.moveColliding(scaledMoving);

		this.sprite.update(delta);
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