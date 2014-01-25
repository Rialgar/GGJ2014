require(['domReady', "Communicator", "Level", "Player"], function(domReady, Communicator, Level, Player) {
	domReady(function() {

		var game = {};

		game.canvas = document.getElementById("canvas");

		game.ratio = game.canvas.width / game.canvas.height;

		game.camera = new THREE.OrthographicCamera(-960 / 32, 960 / 32, 540 / 32, -540 / 32, -500, 1000);

		game.camera.position.z = 100;
		game.camera.lookAt(new THREE.Vector3(0, 0, 0));

		game.scene = new THREE.Scene();

		/*var testMesh = new THREE.Mesh(
		 new THREE.PlaneGeometry(20,20),
		 new THREE.MeshBasicMaterial({color: 0xff00ff})
		 );

		 game.scene.add(testMesh);*/

		game.renderer = new THREE.WebGLRenderer({
			canvas : game.canvas
		});
		game.renderer.setSize(window.innerWidth, window.innerWidth / game.ratio);

		function onWindowResize() {
			game.renderer.setSize(window.innerWidth, window.innerHeight);
		}


		game.level = new Level("./maps/test01.tmx")
		game.level.load(function(sprites) {
			console.log("done");
			game.camera = new THREE.OrthographicCamera(-960 / game.level.tileWidth, 960 / game.level.tileWidth, 540 / game.level.tileHeight, -540 / game.level.tileHeight, -500, 1000);
			game.scene.add(game.level.mesh);
			for(var i = 0; i < sprites.length; i++) {
				game.scene.add(sprites[i]);
			}
		});

		game.scene.add(Player.instance.sprite.mesh);

		Player.instance.level = game.level;

		var stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		document.body.appendChild(stats.domElement);

		game.draw = function() {
			this.camera.position.x = Player.instance.position.x;
			this.camera.position.y = -Player.instance.position.y;
			this.renderer.render(this.scene, this.camera);
			//this.level.draw(ctx, {x:this.canvas.width, y:this.canvas.height}, Player.instance.position);
			//Player.instance.draw(ctx);
		}
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
		}, 10);

		//DEBUG;
		window.game = game;
		window.player = Player.instance;
	});
}); 