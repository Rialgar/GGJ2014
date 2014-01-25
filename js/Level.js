define(function () {
	var Level = function Level(file) {
		this.file = file;
		this.background = document.createElement("canvas");
	};

	Level.prototype = {
		constructor : Level,

		draw: function(ctx, size, offset) {
			for (var x = 0; x < this.width; x++) {
	  			for (var y = 0; y < this.height; y++) {
	  				var tileset = this.tiles[x][y].tileset;

	  				var rx = Math.round((x - offset.x) * this.tileWidth);
	  				var ry = Math.round((y - offset.y) * this.tileHeight);
	  				ry += this.tileHeight - tileset.tileHeight;

	  				if( rx > -tileset.tileWidth && rx < size.x + tileset.tileWidth &&
	  					ry > -tileset.tileHeight && ry < size.y + tileset.tileHeight
	  				){
		  				var tile = this.tiles[x][y];
		  				var tX = (tile.id-tileset.minId) % tileset.width;
		  				var tY = (tile.id-tX-tileset.minId) / tileset.height;
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

					that.tileWidth = parseInt(map.getAttribute("tilewidth"));
					that.tileHeight = parseInt(map.getAttribute("tileheight"));

					// find the tilesets

					that.tilesets = [];
					var tilesets = map.getElementsByTagName("tileset");
					for (var i = 0; i < tilesets.length; i++) {
						var tileset = tilesets[i]

						var tileWidth = parseInt(tileset.getAttribute("tilewidth"));
						var tileHeight = parseInt(tileset.getAttribute("tileheight"));
						
						var imageNode = tileset.childNodes[1];
						var imageWidth = parseInt(imageNode.getAttribute("width"));
						var imageHeight = parseInt(imageNode.getAttribute("height"));
						var imgPath = imageNode.getAttribute("source");
						imgPath = "./maps/" + imgPath;

						that.tilesets[i] = {
							tileWidth: tileWidth,
							tileHeight: tileHeight,		
							width: imageWidth/tileWidth,
							height: imageHeight/tileHeight,
							minId: parseInt(tileset.getAttribute("firstgid")),
							image: new Image()
						};
						that.tilesets[i].image.src = imgPath;
						that.tilesets[i].image.onload = function() {	
							
						};
					};

					function getTileset(tileId){
						for (var i = 0; i < that.tilesets.length; i++) {
							if(i === that.tilesets.length-1 || that.tilesets[i+1].minId > tileId) {
								return that.tilesets[i];
							}
						}
					}

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
								that.tiles[x][y] = {
									id: tile,
									tileset: getTileset(tile)
								}
							}
						}
					}
					
					// process the map objects
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
		}
	}
	
	return Level;
})