require(['domReady', "Communicator", "Player"], function (domReady, Communicator, Player) {
  domReady(function () {

  	var game = {};

  	game.canvas = document.getElementById("canvas");

	var comm = new Communicator();
	comm.connect();
	comm.send("huhu");
	
	window.setInterval(function() {
		comm.send("test");
	}, 1000);


	var player = new Player();
	var animate = function() {
		window.requestAnimationFrame(animate);
		player.update();
	}
	animate();

  	window.game = game;
  });
});