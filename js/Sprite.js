define(["Vector2D"], function(Vector2D) {
	var tileSize = 80;

	var Sprite = function(filename, width, height, rows, collumns, mid, layer, animations) {
		this.mesh = new THREE.Mesh();
		if ( typeof filename === "string") {
			this.texture = THREE.ImageUtils.loadTexture(filename);
			this.material = new THREE.MeshBasicMaterial({
				color : 0xffffff,
				map : this.texture,
				transparent : true
			});
			this.width = width / tileSize;
			this.height = height / tileSize;
			this.mid = mid.copy();
			this.mid.scale(1 / tileSize);
			this.animations = animations;

			this.geometry = new THREE.PlaneGeometry(this.width, this.height);
			this.character = new THREE.Mesh(this.geometry, this.material);
			this.character.position.set(-this.mid.x, this.mid.y, layer);
			this.character.position.z = layer;

			this.initializeUV(rows, collumns);

			this.mesh.add(this.character);
		} else {
			var geom = arguments[0];
			var material = arguments[1];
			var width = arguments[2];
			var height = arguments[3];
			this.width = width / tileSize;
			this.height = height / tileSize;
			this.mid = new Vector2D(0, 10).scale(1 / tileSize);
			this.animations = {};
			material.transparent = true;
			this.character = new THREE.Mesh(geom, material);
			this.character.position.set(-this.mid.x, this.mid.y, 3);
			this.character.position.z = 3;
			this.mesh.add(this.character);
		}
		this.shadow = new THREE.Mesh(
			new THREE.PlaneGeometry(0.8, 0.75),
			new THREE.MeshBasicMaterial({color: 0xffffff, map: THREE.ImageUtils.loadTexture("./maps/shadow.png"), transparent: true})
		);
		this.mesh.add(this.shadow)

		if(this.animations["idle"]){
			this.setAnimation(false);
		}
	};

	Sprite.prototype = {
		constructor : Sprite,

		setPosition : function(pos) {
			this.mesh.position.x = pos.x;
			this.mesh.position.y = -pos.y;
		},

		setJumpHeight : function(height) {
			this.character.position.y = this.mid.y+height;
		},

		setUV: function(x0, x1, y0, y1){
			//0 0 0 -> 0 1
			this.geometry.faceVertexUvs[0][0][0].x = x0;
			this.geometry.faceVertexUvs[0][0][0].y = y1;
			//0 0 1 -> 0 0
			this.geometry.faceVertexUvs[0][0][1].x = x0;
			this.geometry.faceVertexUvs[0][0][1].y = y0;
			//0 0 2 -> 1 1
			this.geometry.faceVertexUvs[0][0][2].x = x1;
			this.geometry.faceVertexUvs[0][0][2].y = y1;

			//0 1 0 -> 0 0
			this.geometry.faceVertexUvs[0][1][0].x = x0;
			this.geometry.faceVertexUvs[0][1][0].y = y0;
			//0 1 1 -> 1 0
			this.geometry.faceVertexUvs[0][1][1].x = x1;
			this.geometry.faceVertexUvs[0][1][1].y = y0;
			//0 1 2 -> 1 1
			this.geometry.faceVertexUvs[0][1][2].x = x1;
			this.geometry.faceVertexUvs[0][1][2].y = y1;
		},

		initializeUV: function (rows, columns) {

			var x0 = 0;
			var y1 = 1;

			var x1 = 1/columns;
			var y0 = 1-(1/rows);

			this.setUV(x0,x1,y0,y1);
		},

		setVertexUVsForAnimationFrame: function(frame){
			var dx = this.geometry.faceVertexUvs[0][0][2].x - this.geometry.faceVertexUvs[0][0][0].x;
			var dy = this.geometry.faceVertexUvs[0][0][0].y - this.geometry.faceVertexUvs[0][0][1].y;

			this.setUV(frame.x*dx, (frame.x+1)*dx, frame.y*dy, (frame.y+1)*dy);
		},

		setAnimation: function(name){
			if(!name){
				this.setVertexUVsForAnimationFrame(this.animations["idle"][0]);
				this.activeAnimation = false;
			} else {
				this.activeAnimation = this.animations[name];
				if(this.activeAnimation){
					this.animationTime = this.activeAnimation[0].time;
					this.animationStep = 0;
				}
			}
		},

		update: function(delta) {
			if(this.activeAnimation && this.activeAnimation.length > 0){
				this.animationTime -= delta;
				while(this.animationTime < 0){
					this.animationTime += this.activeAnimation[this.animationStep];
					this.animationStep++;
				}
				if(this.animationStep >= this.activeAnimation.length){
					this.setAnimation(false);
				} else {
					this.setVertexUVsForAnimationFrame(this.activeAnimation[this.animationStep]);
				}
			}
		}
	};

	return Sprite;
}); 