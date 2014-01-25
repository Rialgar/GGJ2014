define(["Vector2D"], function(Vector2D) {
	var tileSize = 80;

	var Sprite = function(filename, width, height, mid, layer, animations) {
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
			this.mesh = new THREE.Mesh(this.geometry, this.material);
			this.mesh.position.x = -this.mid.x;
			this.mesh.position.y = this.mid.y;
			this.mesh.position.z = layer;
		} else {
			var geom = arguments[0];
			var material = arguments[1];
			var width = arguments[2];
			var height = arguments[3];
			this.width = width / tileSize;
			this.height = height / tileSize;
			this.mid = new Vector2D(46, 50).scale(1 / tileSize);
			this.animations = {};
			material.transparent = true;
			this.mesh = new THREE.Mesh(geom, material);
			this.mesh.position.set(-this.mid.x, this.mid.y, 2);
		}
	};

	Sprite.prototype = {
		constructor : Sprite,

		setPosition : function(pos) {
			this.mesh.position.x = pos.x - this.mid.x;
			this.mesh.position.y = -(pos.y - this.mid.y);
		}
	};

	return Sprite;
}); 