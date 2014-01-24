require(['domReady', "Communicator", "Player"], function (domReady, Communicator, Player) {
  domReady(function () {

  	var game = {};

  	game.canvas = document.getElementById("canvas");

	var player = new Player();
	var lastTime = null;
	var animate = function(timeStamp) {
		window.requestAnimationFrame(animate);
		var delta = timeStamp - lastTime;
		lastTime = timeStamp;
		
		if(delta > 100) {
			console.log("frame skipped because of too large delta");
			return;
		}
		player.update(delta);
	}
	animate();

  	window.game = game;
  });
});