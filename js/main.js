require(['domReady'], function (domReady) {
  domReady(function () {

  	var game = {};

  	game.canvas = document.getElementById("canvas");

  	window.game = game;
  });
});