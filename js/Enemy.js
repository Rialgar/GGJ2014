define(["Sprite", "Vector2D"], function(Sprite, Vector2D){
	var signum = function(x){
		return x > 0 ? 1 : x < 0 ? -1 : 0;
	}
	var Enemy = function(geom, material, width, height){
		this.sprite = new Sprite(geom, material, width, height);
	};

	Enemy.prototype = {
		getPosition: function(){
			return new Vector2D(this.sprite.mesh.position.x, -this.sprite.mesh.position.y);
		},

		setPosition: function(pos){
			this.sprite.setPosition(pos);
		},

		update: function(delta){
			if(this.target){
				this.animTime -= delta;
				if(this.animTime < 0){
					this.sprite.setPosition(this.target);
					this.sprite.setJumpHeight(0);
					delete this.target;
				} else {
					var fr = this.from.copy();
					var tg = this.target.copy();

					fr.scale(this.animTime / 1000);
					tg.scale(1 - this.animTime / 1000);

					tg.add(fr);
					this.sprite.setPosition(tg);

					this.sprite.setJumpHeight(1 - (this.animTime-500)/500 * (this.animTime-500)/500);
				}
			}else if(this.game){
				var dir = game.getRoundedPlayerPosition();
				dir.sub(this.getPosition());

				if(dir.lengthSq() <= 225){
					var d1, d2;
					if(Math.abs(dir.x) > Math.abs(dir.y)){
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

					if(d1.lengthSq() > 0 && !game.level.collides(t1)){
						this.jump(d1);
					}else if(d2.lengthSq() > 0 && !game.level.collides(t2)){
						this.jump(d2);
					}
				}
			}
		},

		jump: function(direction){
			if(!this.target){
				this.from = this.getPosition();
				this.target = this.getPosition();
				this.target.add(direction);
				this.animTime = 1000;
			}
		}
	};

	return Enemy;
})