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
var noStrictSequence = [];
var strictStatus = false;
var strictClicked = false;
var score = 0;
var greenAudio = new Audio('sounds/green.mp3');
var redAudio = new Audio('sounds/red.mp3');
var blueAudio = new Audio('sounds/blue.mp3');
var yellowAudio = new Audio('sounds/yellow.mp3');
var playStatus = true;
var playerCounter = 0;
var round = 1;

$(document).ready(function(){
	$(".start-button").click(function(){
		if ($(this).attr("class") == "new-game start-button"){
			$(".message").fadeToggle();
		}
		if (strictClicked) {
			//strict goes in effect when the game restarts.
			strictStatus = true;
		}
		playerCounter = 0;
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
				$(".message-text").html("Oooops, you got it wrong!<br/>Your score is " + score);
				$(".message").fadeToggle();
			} else if (playerRight && playerCounter == 20) {
				score++;
				updateScore(score);
				$(".message-text").html("Great job, you won!")
				$(".message").fadeToggle();
			} else if (playerRight && playerCounter == sequence.length){
				playStatus = true;
				playerCounter = 0;
				score++;
				updateScore(score);
				setTimeout(function() {
					generateSequence();
					playCpuSequence();	
				}, 1000);
			}
		}
	})
	
	$(".strict").click(function(){
		var strictClicked = true;
		strictStatus = !strictStatus;
		$(".strict-button").toggleClass("strict-on");
	})
})

function generateSequence(){
	if (strictStatus) {
		sequence.push(colors[Math.floor(Math.random() * 4)]);
	} else if ((!strictStatus && round == 1) ||
		(!strictStatus && round > 1 && sequence.length >= noStrictSequence.length)){
		sequence.push(colors[Math.floor(Math.random() * 4)]);
		noStrictSequence.push(sequence[sequence.length - 1]);
		round++;
	} else if (!strictStatus && round > 1 && sequence.length < noStrictSequence.length) {
		sequence.push(noStrictSequence[sequence.length]);
	}
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
		}, 500);
		playSound(color);
		if (i == sequence.length - 1) {
			clearInterval(timer);
			playStatus = false;
		}
		i++;
	}, 750);
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
		return true;
	} else {
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