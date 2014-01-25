require(["domReady", "Communicator", "Level"], function (domReady, Communicator, Level) {
  domReady(function () {

  	var game = {};

  	game.canvas = document.getElementById("canvas");

  	game.level = new Level("./maps/placeholder.tmx")
  	game.level.load();

  	game.draw = function(){
  		var ctx = this.canvas.getContext("2d");
  		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  		this.level.draw(ctx, {x:this.canvas.width, y:this.canvas.height}, {x:0, y:0});
  	}

	var comm = new Communicator();
	comm.connect();
	comm.send("huhu");
	
	window.setInterval(function() {
		comm.send("test");
	}, 1000);

  	window.game = game;
  });
});