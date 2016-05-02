var colors = ["red", "green", "blue", "yellow"];
var colorCodes = {
	redHeavy: "#BC0000",
	redLight: "#FF1919",
	greenHeavy: "#009600",
	greenLight: "#14D314",
	blueHeavy: "#001EDC",
	blueLight: "#0F30FF",
	yellowHeavy: "#AEAC00",
	yellowLight: "#FFFC08"
}
var sequence = [];
var strictStatus = false;
var score = 0;
var greenAudio = new Audio('sounds/green.mp3');
var redAudio = new Audio('sounds/red.mp3');
var blueAudio = new Audio('sounds/blue.mp3');
var yellowAudio = new Audio('sounds/yellow.mp3');
var playStatus = true;
var playerCounter = 0;

$(document).ready(function(){
	$(".start-button").click(function(){
		sequence = [];
		clicked = undefined;
		score = 0;
		$(".score").html("00");
		generateSequence();
		playCpuSequence();
	})
	
	$(".color-button").mousedown(function(){
		// Checks if cpu is playing its sequence.
		if (!playStatus){
			var clicked = $(this).attr("id");
			$('#' + clicked).css({"backgroundColor": colorCodes[clicked + "Light"]});
			playSound(clicked);
		}
	})

	$(".color-button").mouseup(function(){
		if (!playStatus) {
			var clicked = $(this).attr("id");
			$('#' + clicked).css({"backgroundColor": colorCodes[clicked + "Heavy"]});
			var playerRight = checkPlayerSequence(clicked);
			if (!playerRight) {
				// terminate
			} else if (playerRight && playerCounter == sequence.length){
				playStatus = true;
				playerCounter = 0;
				score++;
				updateScore(score);
				setTimeout(function() {
					generateSequence();
					playCpuSequence();	
				}, 2000);
			}
		}
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
	playStatus = true;
	var i = 0;
	var timer = setInterval(function() {
		/* sequence i is saved in color  because if sequence[i] is in setTimeout function,
		the value of i would change before the heacy color is restored. So it's moved to
		the color variable. */
		var color = sequence[i];
		$("#" + color).css({"backgroundColor": colorCodes[color + "Light"]});
		setTimeout(function() {
			$("#" + color).css({"backgroundColor": colorCodes[color + "Heavy"]});
		}, 1000);
		playSound(color);
		console.log("I");
		if (i == sequence.length - 1) {
			clearInterval(timer);
			playStatus = false;
		}
		i++;
	}, 1500);
}

function playSound(color) {
	switch (color){
		case "red":
			redAudio.play();
			break;
		case "green":
			greenAudio.play();
			break;
		case "blue":
			blueAudio.play();
			break;
		case "yellow":
			yellowAudio.play();
			break;
	}
}

function checkPlayerSequence(clicked){
	playerCounter++;
	// playercounter - 1 because counter is incremented before checking
	if (clicked == sequence[playerCounter - 1]){
		console.log("true")
		return true;
	} else {
		console.log("false")
		return false;
	}
}

function updateScore(score){
	if (score < 10){
		$(".score").html("0" + score);
	} else {
		$(".score").html(score);
	}
}