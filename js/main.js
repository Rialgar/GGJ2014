require(['domReady', "Communicator", "Level", "Player"], function(domReady, Communicator, Level, Player) {
	domReady(function() {

		var game = {};

		game.canvas = document.getElementById("canvas");

		game.ratio = game.canvas.width / game.canvas.height;

		var w = 1920;
		//var w = 1600;
		var h = 1080;
		//var h = 900;

		game.camera = new THREE.OrthographicCamera(-w / 2 / 32, w / 2 / 32, h / 2 / 32, -h / 2 / 32, -500, 1000);

		game.camera.position.z = 100;
		game.camera.lookAt(new THREE.Vector3(0, 0, 0));

		game.scene = new THREE.Scene();

		game.renderer = new THREE.WebGLRenderer({
			canvas : game.canvas
		});
		game.renderer.setSize(window.innerWidth, window.innerWidth / game.ratio);

		function onWindowResize() {
			game.renderer.setSize(window.innerWidth, window.innerHeight);
		}

		game.critters = [];
		game.critterCollide = function(pos) {
			var rx = Math.round(pos.x);
			var ry = Math.round(pos.y);
			for(var i = 0; i < game.critters.length; i++) {
				var critter = game.critters[i];
				if(critter) {
					if(critter.getPosition().x === rx && critter.getPosition().y === ry) {
						//TODO: damage the player or something
						return true;
					}
				}
			}
			return false;
		};

		game.level = new Level("./maps/test01.tmx")
		game.level.load(function(sprites) {
			console.log("done");
			game.critters = sprites;
			game.camera = new THREE.OrthographicCamera(-w / 2 / game.level.tileWidth, w / 2 / game.level.tileWidth, h / 2 / game.level.tileHeight, -h / 2 / game.level.tileHeight, -500, 1000);
			game.scene.add(game.level.mesh);
		});

		game.scene.add(Player.instance.sprite.mesh);

		Player.instance.game = game;

		game.buffer = new THREE.WebGLRenderTarget(w, h);

		game.fullScreenScene = new THREE.Scene();

		game.fullScreenMesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({
			color : 0xffffff,
			map : game.buffer
		}));

		game.fullScreenScene.add(game.fullScreenMesh);

		game.fullScreenCamera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, -500, 1000);

		var stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		document.body.appendChild(stats.domElement);

		game.draw = function() {
			this.camera.position.x = Math.round(Player.instance.position.x * this.level.tileWidth) / this.level.tileWidth;
			this.camera.position.y = -Math.round(Player.instance.position.y * this.level.tileHeight) / this.level.tileHeight;
			this.renderer.render(this.scene, this.camera, this.buffer);
			this.renderer.render(this.fullScreenScene, this.fullScreenCamera);
		}
		var stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		document.body.appendChild(stats.domElement);

		var lastTime = null;
		var animate = function(timeStamp) {
			window.requestAnimationFrame(animate);
			stats.update();

			game.draw();
		}
		animate();

		var d = new Date().valueOf();
		var delta = 1;
		var now = 0;
		window.setInterval(function() {
			now = new Date().valueOf();
			delta = now - d;
			d = now;
			Player.instance.update(delta);
			for (var i = 0; i < game.critters.length; i++) {
				game.critters[i].update(delta);
			};
		}, 10);

		//DEBUG;
		window.game = game;
		window.player = Player.instance;
	});
});
