define(function () {
	var Level = function Level(file) {
		this.file = file;
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

					// find the tileset
					var tileset = map.getElementsByTagName("tileset")[0];
					var tileSize = new Vector2D(tileset.getAttribute("tilewidth"), tileset.getAttribute("tileheight"));
					var imageNode = tileset.childNodes[1];
					var imageSize = new Vector2D(imageNode.getAttribute("width"), image.getAttribute("height"));
					var imgPath = imageNode.getAttribute("source");
					imgPath = imgPath.substr(1);

					var image = new Image();
					image.src = imagePaths;
					image.onload = function() {	
						//TODO: do we need to do something here?
					});

					out.tiles = [];

					// process the map data
					var layers = map.getElementsByTagName("layer");
					for (var i = 0; i < layers.length; i++) {
						var layer = layers[i];
						var layerWidth = layer.getAttribute("width");
						var layerHeight = layer.getAttribute("height");
						var data = layer.childNodes[1];
						var tilesArray = data.textContent.split(",");
						for (var x = 0; x < layerWidth; x++) {
							out.tiles[x] = [];
							for (var y = 0; y < layerHeight; y++) {
								var tile = parseInt(tilesArray[layerSize.x * y + x]);
								out.tiles[x][y] = tile;
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

					cb(out);
				}
			}

			req.send(null);
		}
	}
	
	return Level;
})