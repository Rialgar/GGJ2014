require(['domReady', "Communicator", "Level", "Player"], function (domReady, Communicator, Level, Player) {
  domReady(function () {

  	var game = {};

  	game.canvas = document.getElementById("canvas");

  	game.level = new Level("./maps/placeholder.tmx")
  	game.level.load();

  	game.draw = function(){
  		var ctx = this.canvas.getContext("2d");
  		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  		this.level.draw(ctx, {x:this.canvas.width, y:this.canvas.height}, Player.instance.position);
  	}

	var lastTime = null;
	var animate = function(timeStamp) {
		window.requestAnimationFrame(animate);
		var delta = timeStamp - lastTime;
		lastTime = timeStamp;
		
		if(delta > 100) {
			console.log("frame skipped because of too large delta");
			return;
		}
		Player.instance.update(delta);
		game.draw();
	}
	animate();

	//DEBUG;
  	window.game = game;
  	window.player = Player.instance;
  });
});