/* The colors array, played sequence is generated with the help of this array. */
var colors = ["red", "green", "blue", "yellow"];
/* This objects holds the hex codes of all the colors, heavy color corresponds
to off state and light color to on. A description of each color is used as a key. */
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
/* Sequence array holds the sequence of colors to be played by the CPU. */
var sequence = [];
/* This variable holds the status of the strict-button. When clicked this becomes true. */
var strictClicked = false;
/* The score variable holds the player's score. */
var score = 0;
/* The following four variables are audio objects, one for each color. */
var greenAudio = new Audio('sounds/green.mp3');
var redAudio = new Audio('sounds/red.mp3');
var blueAudio = new Audio('sounds/blue.mp3');
var yellowAudio = new Audio('sounds/yellow.mp3');
/* playStatus is true when CPU is playing a sequence, it is used to prevent the user
from clicking a colored button until the CPU plays the whole sequence. */
var playStatus = true;
/* playerCounter counts how many colors the player has played in the sequence. */
var playerCounter = 0;

/* jQuery handkers must be placed here for proper operation. */
$(document).ready(function(){
	/* Start/reset button click handler */
	$(".start-button").click(function(){
		/* There are two button to start the game, one on the main page, on the message
		div. This is statements checks if the button is the one on the message div, if
		so, the message div is faded out. */
		if ($(this).attr("class") == "new-game start-button"){
			$(".message").fadeToggle();
		}
		/* playerCounter is reset to 0 */
		playerCounter = 0;
		/* sequence is reset. */
		sequence = [];
		/* This variable holds the id of the pressed button color. it is reset to undefined. */
		clicked = undefined;
		/* Score is reset to 0*/
		score = 0;
		/* html in score div displays 0 */
		$(".score").html("00");
		/* generateSequence is called and the CPU starts playing a sequence. */
		generateSequence();
		playCpuSequence();
	})
	
	/* When the green, red, yellow or blue button pressed, the following executes. */
	$(".color-button").mousedown(function(){
		// Checks if CPU is playing its sequence. If not, the function is executed.
		if (!playStatus){
			/* The id of the clicked button is stored in clicked (the id is the color
			itself.) */
			var clicked = $(this).attr("id");
			/* The clicked button is detected and its color is changed to a light
			color. Light color means the button will be lit. */
			$('#' + clicked).css({"backgroundColor": colorCodes[clicked + "Light"]});
			/* playSound function is called with the clicked color to play a sound. */
			playSound(clicked);
		}
	})

	/* This handler handles the case of releasing mouse button after clicking on a
	button color. */
	$(".color-button").mouseup(function(){
		/* checks if CPU is playing sequence or not. */
		if (!playStatus) {
			/* The clicked color is saved in clicked */
			var clicked = $(this).attr("id");
			/* The color is changed to heavy color (button turned off). */
			$('#' + clicked).css({"backgroundColor": colorCodes[clicked + "Heavy"]});
			/* The varible playerRight holds the result of checkPlayerSequence function.
			This function checks if the player is playing the sequence correctly. */
			var playerRight = checkPlayerSequence(clicked);
			/* If the player is wrong: */
			if (!playerRight) {
				/* If strict mode is on, the game ends, a message with result fades in. */
				if (strictClicked) {
					$(".message-text").html("Oooops, you got it wrong! Game is over.<br/>Your score is " + score);
					$(".message").fadeToggle();
				/* If strict mode is off, a warning message appears telling the user that
				the sequence will play again... game is not restarted. */
				} else {
					$(".warning-text").html("Oooops, you got it wrong!<br/>" + 
											"Sequence will play again, focus to get it right.");
					$(".warning-message").fadeToggle();
				}
			/* If the player played the sequence correctly, and the score is 20, the player
			wins and a message appears announcing the win. */
			} else if (playerRight && playerCounter == 20) {
				/* Score is incremented */
				score++;
				/* updateScore function is called to update the html in the score div. */
				updateScore(score);
				$(".message-text").html("Great job, you won!")
				$(".message").fadeToggle();
			/* If the player plays the sequence correctly, and the playerCount (number of
			clicked colored buttons) equal the sequence array length, it means the player
			completed the sequence. */
			} else if (playerRight && playerCounter == sequence.length){
				/* playStatus set to true to stop accepting player input. */
				playStatus = true;
				/* counter reset */
				playerCounter = 0;
				/* Score is updated. */
				score++;
				updateScore(score);
				/* a timer waits for 1 seond before the CPU starts playing its sequence. */
				setTimeout(function() {
					generateSequence();
					playCpuSequence();	
				}, 1000);
			}
		}
	})
	
	/* Strict button event handler. */
	$(".strict").click(function(){
		/* strictClicked is inverted. */
		strictClicked = !strictClicked;
		/* Color of the strict button is changed. */
		$(".strict-button").toggleClass("strict-on");
	})

	/* The continue button (in the warning-message div) handler. */
	$(".continue").click(function(){
		/* The warning message fades out. */
		$(".warning-message").fadeOut();
		/* playerCounter is reset since the player will start playing from beginning. */
		playerCounter = 0;
		/* The last sequence is played again. */
		playCpuSequence();
	})
})

/* generateSequence function, it adds a new color to the sequence to be played. */
function generateSequence(){
	/* A new random color from colors array is generated and pushed into sequence.*/
	sequence.push(colors[Math.floor(Math.random() * 4)]);
}

/* playCpuSequence plays the sequence saved in sequence array. */
function playCpuSequence(){
	/* playStatus set to true to stop player's input. */
	playStatus = true;
	/* i is a counter (no for loop used), it's reset to zero each time function is called. */ 
	var i = 0;
	/* setInterval function which player a color in the sequence every 750 ms. */
	var timer = setInterval(function() {
		/* sequence i is saved in color  because if sequence[i] is in setTimeout function,
		the value of i would change before the heacy color is restored. So it's moved to
		the color variable. */
		var color = sequence[i];
		/* The color is lit. */
		$("#" + color).css({"backgroundColor": colorCodes[color + "Light"]});
		/* timeout is set to turn off the color after 500ms. */
		setTimeout(function() {
			$("#" + color).css({"backgroundColor": colorCodes[color + "Heavy"]});
		}, 500);
		/* The sound is the clicked color is played. */
		playSound(color);
		/* If the whole sequence is played: */
		if (i == sequence.length - 1) {
			/* Timer is cleared, and playStatus set to false to allow player input. */
			clearInterval(timer);
			playStatus = false;
		}
		i++;
	}, 750);
}

/* playSound function plays a sound corresponding to the clicked color. */
function playSound(color) {
	/* A switch statement checks the color and plays its sound. */
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


/* The function checks if the player is still playing the sequence correctly. (checked
after each user's click.) */
function checkPlayerSequence(clicked){
	/* playerCounter incremented */
	playerCounter++;
	/* If the clicked color is the same as the color in sequence array at the index
	if playerCounter, true is returned. Else, the user made a mistake and false is
	returned. */
	// playercounter - 1 because counter is incremented before checking
	if (clicked == sequence[playerCounter - 1]){
		return true;
	} else {
		return false;
	}
}

/* This function updates the score by updating the score div's html. */
function updateScore(score){
	/* The score is always displayed with two digits. If the score is less than 10,
	a zero is added before the score. */
	if (score < 10){
		$(".score").html("0" + score);
	} else {
		$(".score").html(score);
	}
}