require(['domReady', "Communicator"], function (domReady, Communicator) {
  domReady(function () {

  	var game = {};

  	game.canvas = document.getElementById("canvas");

	var comm = new Communicator();
	comm.connect();
	comm.send("huhu");

  	window.game = game;
  });
});