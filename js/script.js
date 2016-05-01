var colors = ["red", "green", "blue", "yellow"];
var sequence = [];
var clicked;
var strictStatus = false;
var score = 0;
var greenAudio = new Audio('sounds/green.mp3');
var redAudio = new Audio('sounds/red.mp3');
var blueAudio = new Audio('sounds/blue.mp3');
var yellowAudio = new Audio('sounds/yellow.mp3');

$(document).ready(function(){
	$(".start-button").click(function(){
		sequence = [];
		clicked = undefined;
		score = 0;
		$(".score").html("00");
		generateSequence();
		playCpuSequence();
	})

	/*
	$(".strict").click(function(){
		strictStatus = !strictStatus;
		$(".strict-button").toggleClass("strict-on");
	})*/
})

function generateSequence(){
	sequence.push(colors[Math.floor(Math.random() * 4)]);
}

function playCpuSequence(){
	var i = 0;
	setInterval(function() {
		switch (sequence[i]){
			case "red":
				$(".red").css({"backgroundColor": "#FF1919"});
				redAudio.play();
				setTimeout(function() {
					$(".red").css({"backgroundColor": "#BC0000"});
				}, 1000);
				break;
			case "green":
				$(".green").css({"backgroundColor": "#14D314"});
				greenAudio.play();
				setTimeout(function() {
					$(".green").css({"backgroundColor": "#009600"});
				}, 1000);
				break;
			case "blue":
				$(".blue").css({"backgroundColor": "#0F30FF"});
				blueAudio.play();
				setTimeout(function() {
					$(".blue").css({"backgroundColor": "#001EDC"});
				}, 1000);
				break;
			case "yellow":
				$(".yellow").css({"backgroundColor": "#FFFC08"});
				yellowAudio.play();
				setTimeout(function() {
					$(".yellow").css({"backgroundColor": "#AEAC00"});
				}, 1000);
				break;
		}
		i++;
	}, 1500);
}