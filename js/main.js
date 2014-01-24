require(["domReady", "Communicator", "Level"], function (domReady, Communicator, Level) {
  domReady(function () {

  	var game = {};

  	game.canvas = document.getElementById("canvas");

  	game.level = new Level("./maps/placeholder.tmx")
  	game.level.load();

	var comm = new Communicator();
	comm.connect();
	comm.send("huhu");
	
	window.setInterval(function() {
		comm.send("test");
	}, 1000);

  	window.game = game;
  });
});