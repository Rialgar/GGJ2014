define(["Vector2D"], function(Vector2D) {
	var tileSize = 80;

	var Sprite = function(filename, width, height, mid, layer, animations) {
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
	};

	Sprite.prototype = {
		constructor : Sprite,

		setPosition : function(pos) {
			this.mesh.position.x = pos.x;
			this.mesh.position.y = -pos.y;
		},

		setJumpHeight : function(height) {
			this.character.position.y = this.mid.y+height;
		}
	};

	return Sprite;
}); 