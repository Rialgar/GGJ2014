require(["domReady", "Communicator", "Level", "Player", "Vector2D", "Enemy"], function(domReady, Communicator, Level, Player, Vector2D, Enemy) {
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
			game.renderer.setSize(window.innerWidth, window.innerWidth / game.ratio);
		}

		window.addEventListener("resize", onWindowResize);

		game.scene.add(Player.instance.sprite.mesh);

		Player.instance.game = game;

		game.getRoundedPlayerPosition = function() {
			return new Vector2D(Math.round(player.position.x), Math.round(player.position.y));
		}

		game.critters = [];
		game.critterCollide = function(pos) {
			var rx = Math.round(pos.x);
			var ry = Math.round(pos.y);
			for (var i = 0; i < game.critters.length; i++) {
				var critter = game.critters[i];
				if (critter && !critter.dead) {
					if (critter.getPosition().x === rx && critter.getPosition().y === ry) {
						if(game.pID === 0) {
							if(!critter.good){
								Player.instance.damage(1);
								Communicator.instance.send({type: "damage", val: Player.instance.LP});
							} else {
								critter.free();
								Communicator.instance.send({type: "free", val: critter.id});
							}
						}
						
						return true;
					}
				}
			}
			return false;
		};

		game.critterHit = function(pos, dir, id) {
			if(id) {
				for (var i = 0; i < game.critters.length; i++) {
					var c = game.critters[i];
					if(c.id === id || c.otherID === id){
						game.critters[i].damage(dir);
						return game.critters[i];
					}
				}
			} else {
				for (var i = 0; i < game.critters.length; i++) {
					var d = game.critters[i].getPosition().sub(dir.multiplied(0.5/dir.length()).add(pos));
					if(!game.critters[i].dead && d.lengthSq() <= 2){
						game.critters[i].damage(dir);
						return game.critters[i];
					}
				}
			}
		}

		Enemy.hearts.forEach(function(ea){
			game.scene.add(ea);
		});

		game.buffer = new THREE.WebGLRenderTarget(w, h,{
			minFilter: THREE.LinearFilter
		});

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
			TWEEN.update();

			game.draw();
		}
		var d = new Date().valueOf();
		var delta = 1;
		var now = 0;

		var findConnectedCritter = function(critter) {
			var critters = game.critters;
			for (var i = 0; i < critters.length; i++) {
				if (critters[i] !== critter && critters[i].getPosition().copy().sub(critter.getPosition()).lengthSq() === 0) {
					return critters[i];
				}
			}
		}
		game.initialize = function(id) {
			// remove the waiting for players tag
			document.getElementById("notification").textContent = "starting game...";
			
			game.pID = id;
			game.level = new Level("./maps/big_map.tmx")
			game.level.load(function(critters) {
				game.critters = critters;

				for (var i = 0; i < critters.length; i++) {
					if(game.pID === 0) {
						// please simulate the critters if you are player 0
						critters[i].game = game;	
					}
					
					var otherCritter = findConnectedCritter(critters[i]);
					if (critters[i].type === "P0" && game.pID === 0) {
						game.level.mesh.add(critters[i].sprite.mesh);
						if (otherCritter) {
							critters.splice(critters.indexOf(otherCritter), 1);
							delete otherCritter;
							i--;
							continue;
						}
					} else if (critters[i].type === "P1" && game.pID === 1) {
						game.level.mesh.add(critters[i].sprite.mesh);
						if (otherCritter) {
							critters[i].otherID = otherCritter.id;
							critters.splice(critters.indexOf(otherCritter), 1);
							delete otherCritter;
							i--;
							continue;
						}
					}

					critters[i].register(this, "land", function(data) {
						if (game.critterCollide(Player.instance.position)) {
							//wegpush
							if(game.level.collides(Player.instance.position.copy().add(data.vec))) {
								data.vec.scale(-1);
							}
							new TWEEN.Tween({
								x : Player.instance.position.x,
								y : Player.instance.position.y
							}).to({
								x : Player.instance.position.x + data.vec.x,
								y : Player.instance.position.y + data.vec.y
							}, 500).easing(TWEEN.Easing.Cubic.Out).onUpdate(function() {
								Player.instance.position.x = this.x;
								Player.instance.position.y = this.y;
							}).start();
						}
					});
				}

				game.camera = new THREE.OrthographicCamera(-w / 2 / game.level.tileWidth, w / 2 / game.level.tileWidth, h / 2 / game.level.tileHeight, -h / 2 / game.level.tileHeight, -500, 1000);
				game.scene.add(game.level.mesh);

				Communicator.instance.sendReady();
			});
		};
		game.startGame = function() {
			//document.getElementById("notification").textContent = "";
			document.getElementById("welcome").style.opacity = "0";
			animate();
			window.setInterval(function() {
				now = new Date().valueOf();
				delta = now - d;
				d = now;
				Player.instance.update(delta);
				for (var i = 0; i < game.critters.length; i++) {
					game.critters[i].update(delta);
				};
				Enemy.updateHearts(delta);
			}, 10);
		};
		Communicator.instance.game = game;

		//DEBUG;
		window.game = game;
		window.player = Player.instance;
	});
});
