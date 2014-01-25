define(["Sprite", "Vector2D", "Emitter"], function(Sprite, Vector2D, Emitter) {
	var signum = function(x) {
		return x > 0 ? 1 : x < 0 ? -1 : 0;
	}

	var jumpTime = 800;

	var Enemy = function(geom, material, width, height, type, LP){
		Emitter.call(this);
		this.sprite = new Sprite(geom, material, width, height);
		this.type = type;
		this.jumpingDirection = null;
		this.LP = LP || 0;
		this.game = null;
	};

	Enemy.prototype = Object.create(Emitter.prototype);
	Enemy.prototype.constructor = Enemy;

	Enemy.prototype.getPosition = function() {
		return new Vector2D(this.sprite.mesh.position.x, -this.sprite.mesh.position.y);
	};

	Enemy.prototype.setPosition = function(pos) {
		this.sprite.setPosition(pos);
	};
	Enemy.prototype.die = function(){
			this.sprite.character.material.color = 0x888888;
			this.sprite.character.material.needsUpdate = true;
			this.dead = true;
		};

	Enemy.prototype.damage = function(dir){
			this.LP--;
			if(this.LP < 0){
				this.die();
			}
		};

	Enemy.prototype.update = function(delta) {
		if (this.target) {
			this.animTime -= delta;
			if (this.animTime < 0) {
				this.sprite.setPosition(this.target);
				this.sprite.setJumpHeight(0);
				delete this.target;

				//TODO: emit landing event here
				this.emit("land", {pos: this.target, vec: this.jumpingDirection});
			} else {
				var fr = this.from.copy();
				var tg = this.target.copy();

				fr.scale(this.animTime / jumpTime);
				tg.scale(1 - this.animTime / jumpTime);

				tg.add(fr);
				this.sprite.setPosition(tg);

				var d = (this.animTime - jumpTime/2) / (jumpTime/2);

				this.sprite.setJumpHeight(1 -  d*d);
			}
		} else if (!this.dead && this.game) {
			var dir = game.getRoundedPlayerPosition();
			dir.sub(this.getPosition());

			if (dir.lengthSq() <= 225) {
				var d1, d2;
				if (Math.abs(dir.x) > Math.abs(dir.y)) {
					d1 = new Vector2D(signum(dir.x), 0);
					d2 = new Vector2D(0, signum(dir.y));
				} else {
					d1 = new Vector2D(0, signum(dir.y));
					d2 = new Vector2D(signum(dir.x), 0);
				}
				var t1 = d1.copy();
				var t2 = d2.copy();
				t1.add(this.getPosition());
				t2.add(this.getPosition());

				if (d1.lengthSq() > 0 && !game.level.collides(t1)) {
					this.jump(d1);
				} else if (d2.lengthSq() > 0 && !game.level.collides(t2)) {
					this.jump(d2);
				}
			}
		}
	};

	Enemy.prototype.jump = function(direction) {
		if (!this.target) {
			this.from = this.getPosition();
			this.target = this.getPosition();
			this.target.add(direction);
			this.jumpingDirection = direction;


			this.animTime = jumpTime;
		}
	};

	return Enemy;
}); 