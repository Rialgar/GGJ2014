define(["Sprite", "Vector2D", "Emitter", "Communicator"], function(Sprite, Vector2D, Emitter, Communicator) {
	var signum = function(x) {
		return x > 0 ? 1 : x < 0 ? -1 : 0;
	}

	var relations = [[146, 147],[148, 149]]; //[good, bad]

	var isGood = function(id){
		for (var i = 0; i < relations.length; i++) {
			if(relations[i][0] === id){
				return true;
			}
		};
		return false;
	}

	var deadMaterials = [
		new THREE.MeshBasicMaterial({color: 0xffffff, map: THREE.ImageUtils.loadTexture("./maps/skelett.png"), transparent: true}),
		new THREE.MeshBasicMaterial({color: 0xffffff, map: THREE.ImageUtils.loadTexture("./maps/spross.png"), transparent: true})
	];

	var setMeshToDead = function(mesh, good){
		mesh.material = deadMaterials[good ? 0 : 1];
	}

	var vanishingPoints = [{x:31, y:204}];

	var jumpTime = 800;

	var Enemy = function(geom, material, width, height, type, gid){
		Emitter.call(this);
		this.sprite = new Sprite(geom, material, width, height);
		this.type = type;
		this.gid = gid;
		this.good = isGood(gid);
		this.jumpingDirection = null;
		this.LP = 1;
		this.id = 0;
		this.game = null;
		this.otherID = null;
		var that = this;
		
		Communicator.instance.register(this, "jump", function(data) {
			if(data.id === that.id || data.id === that.otherID) {
				// process the jump data
				that.jump(new Vector2D(data.vec.x,data.vec.y).sub(this.getPosition()));
			}
		});
		Communicator.instance.register(this, "free", function(id) {
			if(id === that.id || id === that.otherID) {
				// process the free data
				that.free();
			}
		});
	};

	var icongeometry = new THREE.PlaneGeometry(48/80,48/80);
	var iconMaterials = {
		heart: new THREE.MeshBasicMaterial({color:0xffffff, map:THREE.ImageUtils.loadTexture("./maps/hearticon.png")}),
		frownie: new THREE.MeshBasicMaterial({color:0xffffff, map:THREE.ImageUtils.loadTexture("./maps/frownieicon.png")})
	};
	Enemy.icons = [];
	for (var i = 0; i < 20; i++) {
		Enemy.icons.push(new THREE.Mesh(icongeometry, iconMaterials["heart"]));
		Enemy.icons[i].position.z = 9;
		Enemy.icons[i].active = -1;
		Enemy.icons[i].visible = false;
	}

	Enemy.updateIcons = function(delta){
		for (var i = 0; i < 20; i++) {
			if(Enemy.icons[i].active >= 0) {
				Enemy.icons[i].active -= delta;
				Enemy.icons[i].position.y += delta/1000;
				if(Enemy.icons[i].active <= 0){
					Enemy.icons[i].visible = false;
				}
			}
		}		
	}

	Enemy.spawnIcon = function(pos, type){
		var icon = Enemy.icons.shift();

		icon.position.x = pos.x;
		icon.position.y = -pos.y;
		icon.material = iconMaterials[type];
		icon.visible = true;
		icon.active = 2000;

		Enemy.icons.push(icon);
	}

	Enemy.spawnHeart = function(pos){
		Enemy.spawnIcon(pos, "heart");
	}

	Enemy.spawnFrownie = function(pos){
		Enemy.spawnIcon(pos, "frownie");
	}

	Enemy.prototype = Object.create(Emitter.prototype);
	Enemy.prototype.constructor = Enemy;

	Enemy.prototype.getPosition = function() {
		return new Vector2D(this.sprite.mesh.position.x, -this.sprite.mesh.position.y);
	};

	Enemy.prototype.setPosition = function(pos) {
		this.sprite.setPosition(pos);
	};

	Enemy.prototype.free = function(){
		if(!this.wasFree){
			this.wasFree = true;
			var closest = {};
			var d = Infinity;
			for (var i = 0; i < vanishingPoints.length; i++) {
				var d2 = this.getPosition().sub(vanishingPoints[i]).lengthSq();
				if(d2 < d){
					closest = vanishingPoints[i];
					d = d2;
				}
			};
			this.vanishingPoint = new Vector2D(closest.x,closest.y);
		}
	};

	Enemy.prototype.die = function(){
		setMeshToDead(this.sprite.character, this.good);
		if(this.good){
			Enemy.spawnFrownie(this.getPosition());
			this.emit("slaughtered");
		}
		this.dead = true;
		this.emit("die");
	};


	Enemy.prototype.damage = function(dir){
		this.LP--;
		if(this.good || this.LP < 0){
			this.die();
		}
		this.pushDir = dir.copy().normalize().scale(15);
		this.pushTime = 500;
	};

	Enemy.prototype.update = function(delta) {
		if(this.pushDir){
			var d = Math.min(delta, this.pushTime);
			this.pushTime -= d;

			var pushVector = this.pushDir.multiplied(d/1000);

			this.pushDir.scale(9.5/d);

			this.setPosition(this.getPosition().add(pushVector));
			if(this.target){
				this.target.add(pushVector);
			}

			if(this.pushTime <= 0){
				this.pushDir = false;
			}
		}
		if (this.target) {
			this.animTime -= delta;
			if (this.animTime <= 0) {
				this.sprite.setPosition(this.target);
				this.sprite.setJumpHeight(0);
				this.sprite.character.position.z = 3;
				delete this.target;

				this.emit("land", {pos: this.target, vec: this.jumpingDirection});
			} else {
				var fr = this.from.copy();
				var tg = this.target.copy();

				fr.scale(this.animTime / jumpTime);
				tg.scale(1 - this.animTime / jumpTime);

				tg.add(fr);
				this.sprite.setPosition(tg);
				this.sprite.character.position.z = 5;

				var d = (this.animTime - jumpTime/2) / (jumpTime/2);

				this.sprite.setJumpHeight(1 -  d*d);
			}
		} else if(!this.dead){
			var dir = new Vector2D(200,200);
			if (this.wasFree){
				dir = this.vanishingPoint.copy().sub(this.getPosition());
			} else if (this.game) {
				dir = this.game.getRoundedPlayerPosition();
				dir.sub(this.getPosition());
			}

			if (dir.lengthSq() <= 225) {
				if(this.wasFree && dir.lengthSq() === 0){
					this.dead = true;
					this.sprite.character.visible = false;
					this.sprite.shadow.visible = false;
					this.target = false;
					this.emit("die");
				}
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

				if (this.wasFree || (d1.lengthSq() > 0 && !game.level.collides(t1))) {
					this.jump(d1);
					Communicator.instance.send({type: "jump", val:{id: this.id, vec : this.target}});
				} else if (d2.lengthSq() > 0 && !game.level.collides(t2)) {
					this.jump(d2);
					Communicator.instance.send({type: "jump", val:{id: this.id, vec : this.target}});
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
			if(this.wasFree){
				Enemy.spawnHeart(this.getPosition());
			}
		}
	};

	return Enemy;
}); 