define(["Vector2D"], function (Vector2D) {
	var Level = function Level(file) {
		this.file = file;
	};

	Level.prototype = {
		constructor : Level,

		draw: function(ctx, size, playerPosition) {
			if(!this.tileset) {
				return;
			}
			var tmp = new Vector2D(size.x, size.y).scale(.5 / this.tileset.tileWidth);
			var offset = playerPosition.copy().sub(tmp);
			for (var x = 0; x < this.width; x++) {
	  			for (var y = 0; y < this.height; y++) {
	  				var tileset = this.tileset;

	  				var rx = Math.round((x - offset.x) * tileset.tileWidth);
	  				var ry = Math.round((y - offset.y) * tileset.tileHeight);
	  				if( rx > -tileset.tileWidth && rx < size.x + tileset.tileWidth &&
	  					ry > -tileset.tileHeight && ry < size.y + tileset.tileHeight
	  				){
		  				var tile = this.tiles[x][y];
		  				var tX = (tile-1) % tileset.width;
		  				var tY = (tile-tX-1) / tileset.height;
		  				tX *= tileset.tileWidth;
		  				tY *= tileset.tileHeight
		  				ctx.drawImage(tileset.image,
		  					tX, tY, tileset.tileWidth, tileset.tileHeight,
		  					rx, ry, tileset.tileWidth, tileset.tileHeight
		  				);
		  			}
	  			};
	  		};
		},

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

					// find the tileset
					var tileset = map.getElementsByTagName("tileset")[0];
					var tileWidth = parseInt(tileset.getAttribute("tilewidth"));
					var tileHeight = parseInt(tileset.getAttribute("tileheight"));
					
					var imageNode = tileset.childNodes[1];
					var imageWidth = parseInt(imageNode.getAttribute("width"));
					var imageHeight = parseInt(imageNode.getAttribute("height"));
					var imgPath = imageNode.getAttribute("source");
					imgPath = "./maps/" + imgPath;

					that.tileset = {
						tileWidth: tileWidth,
						tileHeight: tileHeight,		
						width: imageWidth/tileWidth,
						height: imageHeight/tileHeight,
						image: new Image()
					};
					that.tileset.image.src = imgPath;
					that.tileset.image.onload = function() {	
						//TODO: do we need to do something here?
					};

					that.tiles = [];

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
								that.tiles[x][y] = tile;
							}
						}
					}
					
					// process the map data
					var objects = map.getElementsByTagName("object");
					for (var i = 0; i < objects.length; i++) {
						var object = objects[i];
						var x = parseInt(object.getAttribute("x")) / 32;
						var y = -parseInt(object.getAttribute("y")) / 32;
						
						//TODO: do something with objects.
					}

					if(typeof cb === "function")
					{
						cb();
					}
				}
			}

			req.send(null);
		},
		
		collides: function(x,y) {
			var cx = Math.round(x);
			var cy = Math.round(y);
			if(!this.tiles || !this.tiles[cx] || !this.tiles[cx][cy] || [4].indexOf(this.tiles[cx][cy]) !== -1) {
				return true;
			}
			return false;
		}
	}
	
	return Level;
})