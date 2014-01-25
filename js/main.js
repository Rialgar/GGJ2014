require(['domReady', "Communicator", "Level", "Player"], function (domReady, Communicator, Level, Player) {
  domReady(function () {

  	var game = {};

  	game.canvas = document.getElementById("canvas");

  	game.level = new Level("./maps/placeholder.tmx")
  	game.level.load();
  	
  	var stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.body.appendChild(stats.domElement);


  	game.draw = function(){
  		var ctx = this.canvas.getContext("2d");
  		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  		this.level.draw(ctx, {x:this.canvas.width, y:this.canvas.height}, Player.instance.position);
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
	},10);

	//DEBUG;
  	window.game = game;
  	window.player = Player.instance;
  });
});