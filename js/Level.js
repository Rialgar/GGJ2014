define(["Vector2D", "Sprite", "Enemy"], function (Vector2D, Sprite, Enemy) {
	var collisions = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,16,17,18,19,20,21,22,24,29,30,31,33,34,36,37,38,45,46,47,48,56,57,60];
	var Level = function Level(file) {
		this.file = file;
		this.background = document.createElement("canvas");
	};

	Level.prototype = {
		constructor : Level,

		load : function(cb) {
			var req = new XMLHttpRequest();
			req.open("GET", this.file, true);
			var that = this;
			req.onreadystatechange = function() {
				if (req.readyState == 4) {
					var out = {};

					var parser = new DOMParser();
					var xmlDoc = parser.parseFromString(req.responseText, "application/xml");

					//determine the size of the map
					var map = xmlDoc.firstChild;

					that.width = parseInt(map.getAttribute("width"));
					that.height = parseInt(map.getAttribute("width"));

					that.tileWidth = parseInt(map.getAttribute("tilewidth"));
					that.tileHeight = parseInt(map.getAttribute("tileheight"));

					// find the tilesets

					that.tilesets = [];
					var tilesets = map.getElementsByTagName("tileset");
					for (var i = 0; i < tilesets.length; i++) {
						var tilesetNode = tilesets[i]

						var tileWidth = parseInt(tilesetNode.getAttribute("tilewidth"));
						var tileHeight = parseInt(tilesetNode.getAttribute("tileheight"));
						
						var imageNode = tilesetNode.childNodes[1];
						var imageWidth = parseInt(imageNode.getAttribute("width"));
						var imageHeight = parseInt(imageNode.getAttribute("height"));
						var imgPath = imageNode.getAttribute("source");
						imgPath = "./maps/" + imgPath;

						var tileset = {
							tileWidth: tileWidth,
							tileHeight: tileHeight,		
							width: imageWidth/tileWidth,
							height: imageHeight/tileHeight,
							minId: parseInt(tilesetNode.getAttribute("firstgid")),
							texture: THREE.ImageUtils.loadTexture(imgPath)
						};
						tileset.texture.magFilter = THREE.NearestFilter;
						tileset.texture.minFilter = THREE.NearestFilter;
						tileset.material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: tileset.texture  } );
						tileset.deadMaterial = new THREE.MeshBasicMaterial( { color: 0xaaaaaa, map: tileset.texture  } );

						tileset.geometries = [];
						for (var x = 0; x < tileset.width; x++) {
				  			for (var y = 0; y < tileset.height; y++) {
				  				var id = y*tileset.width + x;

				  				var x0 = x / tileset.width;
				  				var y1 = 1-(y / tileset.height);

				  				var x1 = (x+1) / tileset.width;
				  				var y0 = 1-((y+1) / tileset.height);

				  				var geometry = new THREE.PlaneGeometry(
				  					tileset.tileWidth/that.tileWidth,
				  					tileset.tileHeight/that.tileHeight
				  				);

								//0 0 0 -> 0 1
				  				geometry.faceVertexUvs[0][0][0].x = x0;
				  				geometry.faceVertexUvs[0][0][0].y = y1;
				  				//0 0 1 -> 0 0
				  				geometry.faceVertexUvs[0][0][1].x = x0;
				  				geometry.faceVertexUvs[0][0][1].y = y0;
				  				//0 0 2 -> 1 1
				  				geometry.faceVertexUvs[0][0][2].x = x1;
				  				geometry.faceVertexUvs[0][0][2].y = y1;

				  				//0 1 0 -> 0 0
				  				geometry.faceVertexUvs[0][1][0].x = x0;
				  				geometry.faceVertexUvs[0][1][0].y = y0;
				  				//0 1 1 -> 1 0
				  				geometry.faceVertexUvs[0][1][1].x = x1;
				  				geometry.faceVertexUvs[0][1][1].y = y0;
				  				//0 1 2 -> 1 1
				  				geometry.faceVertexUvs[0][1][2].x = x1;
				  				geometry.faceVertexUvs[0][1][2].y = y1;

				  				tileset.geometries[id] = geometry;
				  			}
				  		}

						that.tilesets[i] = tileset;
					};

					function getTileset(tileId){
						for (var i = 0; i < that.tilesets.length; i++) {
							if(i === that.tilesets.length-1 || that.tilesets[i+1].minId > tileId) {
								return that.tilesets[i];
							}
						}
					}

					function getGeometry(tileId){
						var tileset = getTileset(tileId);
						return tileset.geometries[tileId - tileset.minId];
					}

					window.getGeometry = getGeometry;

					that.tiles = [];
					that.geom = new THREE.Geometry();

					// process the map data
					var layers = map.getElementsByTagName("layer");
					for (var i = 0; i < layers.length; i++) {
						var layer = layers[i];
						var layerWidth = parseInt(layer.getAttribute("width"));
						var layerHeight = parseInt(layer.getAttribute("height"));
						var data = layer.childNodes[1];
						var tilesArray = data.textContent.split(",");
						for (var x = 0; x < layerWidth; x++) {
							that.tiles[x] = [];
							for (var y = 0; y < layerHeight; y++) {
								var tile = parseInt(tilesArray[layerWidth * y + x]);
								var tileset = getTileset(tile);

								var rx = x;
				  				var ry = y;
				  				ry += (that.tileHeight - tileset.tileHeight)/that.tileHeight;

				  				var tX = (tile-tileset.minId) % tileset.width;
				  				var tY = (tile-tX-tileset.minId) / tileset.height;

				  				var mesh = new THREE.Mesh(
				  					getGeometry(tile)
				  				);

				  				mesh.position.x = rx;
				  				mesh.position.y = -ry;

				  				THREE.GeometryUtils.merge( that.geom, mesh );

				  				that.tiles[x][y] = tile;
							}
						}
					}
					
					that.mesh = new THREE.Mesh( that.geom, that.tilesets[0].material);

					// process the map objects
					var enemies = [];
					
					var objects = map.getElementsByTagName("object");
					for (var i = 0; i < objects.length; i++) {
						var object = objects[i];
						var x = parseInt(object.getAttribute("x"));
						var y = parseInt(object.getAttribute("y"));
						var gid = parseInt(object.getAttribute("gid"));
						//TODO: do something with objects.
						var type = object.parentNode.getAttribute("name");
						var tileset = getTileset(gid);
						var enemy = new Enemy(getGeometry(gid), tileset.material, tileset.deadMaterial, tileset.tileWidth, tileset.tileHeight, type);
						enemy.setPosition(new Vector2D(Math.round(x/that.tileWidth), Math.round(y/that.tileHeight)-1));

						//that.mesh.add(enemy.sprite.mesh);

						enemies.push(enemy);
					}
					if(typeof cb === "function")
					{
						cb(enemies);
					}
				}
			}

			req.send(null);
		},
		
		collides: function(pos) {
			var cx = Math.round(pos.x);
			var cy = Math.round(pos.y);
			if(!this.tiles || !this.tiles[cx] || !this.tiles[cx][cy] || collisions.indexOf(this.tiles[cx][cy]) !== -1) {
				return true;
			}
			return false;
		}
	}
	
	return Level;
})