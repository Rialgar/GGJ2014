define(["Sprite", "Vector2D"], function(Sprite, Vector2D){
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