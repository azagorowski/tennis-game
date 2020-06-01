// Based on Chris DeLeon (gamkedo) JavaScript game course.

var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 15;
var ballSpeedY = 10;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 7;
const PADDLE_HEIGHT = 100;

function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

function handleMouseClick(evt) {
	if(showingWinScreen) {
		player1Score = 0;
		player2Score = 0;
		showingWinScreen = false;
	}
}

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	
	var framesPerSecond = 30;
	setInterval(function() {
		moveEverything();
		drawEverything();
	}, 1000/framesPerSecond);
	
	canvas.addEventListener('mousedown',handleMouseClick);
	
	canvas.addEventListener('mousemove',
		function(evt) {
			var mousePos = calculateMousePos(evt);
			paddle1Y = mousePos.y-(PADDLE_HEIGHT/2);
		});
}

function ballReset() {
	if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
		showingWinScreen = true;
	}

	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}	

//Set computer speed
function computerMovement() {
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
	if(paddle2YCenter < ballY-35) {
		paddle2Y += 16;
	} else if(paddle2YCenter > ballY+35){
		paddle2Y -= 16;
	}
}

function moveEverything() {
	if(showingWinScreen) {
		return;
	}

	computerMovement();
	
	ballX += ballSpeedX;
	ballY += ballSpeedY;
	
	if(ballX < 0) {
		if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;
			
			var deltaY = ballY-(paddle1Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
			hit.play();
		} else {
			ballOut.play();
			player2Score++; // Score should be added before ball reset function
			ballReset();
		}
	}
	if(ballX > canvas.width) {
		if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;
			
			var deltaY = ballY-(paddle2Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
			hitAi.play();
		} else {
			ballOut.play();
			player1Score++; 
			ballReset();
		}
	}
	
	if(ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
	if(ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}
}

function drawNet() {
	for(var i=0;i<canvas.height; i+=40) {
		colorRect(canvas.width/2-1, i, 2, 20, '#F79F81');
	}
}

// Loading audio
let gameover = new Audio();
let hit = new Audio();
let hitAi = new Audio();
let ballOut = new Audio();

gameover.src = "audio/gameover.wav";
hit.src = "audio/hit.wav";
hitAi.src = "audio/hit-ai.wav";
ballOut.src = "audio/ballout.wav";
	
function drawEverything() {
	
	// blanks out the screen with black
	colorRect(0, 0, canvas.width, canvas.height, 'black');
	
	if(showingWinScreen) {
		gameover.play();
		canvasContext.fillStyle = 'white';
	
		if(player1Score >= WINNING_SCORE) {
		canvasContext.fillText("Human Player Won !", 290, 200);
		} else if(player2Score >= WINNING_SCORE) {
		canvasContext.fillText("Computer Won !", 310, 200);
		}

		canvasContext.fillText("Click to continue", 310, 400);
		return;
	}
	
	drawNet();
	
	// left player paddle
	colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, '#F5D0A9');
	
	// right computer paddle
	colorRect(canvas.width-PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, '#F5D0A9');
	
	// ball
	colorCircle(ballX, ballY, 12, '#F3F781');
	
	//score
	canvasContext.fillStyle = '#66ff8c';
	canvasContext.font = "22px Montserrat";
	
	
	canvasContext.fillText("P1 Score: " + player1Score, 100, 100);
	canvasContext.fillText("P2 Score: " + player2Score, canvas.width-200, 100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2, true);
	canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height);
}

/* Scrolling speed

Source:

How to change default scrollspeed,scrollamount,scrollinertia of a webpage
https://stackoverflow.com/questions/14426548/how-to-change-default-scrollspeed-scrollamount-scrollinertia-of-a-webpage#answer-14430585
*/

 function wheel(event) {
      var delta = 0;
      if (event.wheelDelta) {(delta = event.wheelDelta / 120);}
      else if (event.detail) {(delta = -event.detail / 3);}

      handle(delta);
      if (event.preventDefault) {(event.preventDefault());}
      event.returnValue = false;
  }

  function handle(delta) {
      var time = 1000;
      var distance = 300;

      $('html, body').stop().animate({
          scrollTop: $(window).scrollTop() - (distance * delta)
      }, time );
  }

  if (window.addEventListener) {window.addEventListener('DOMMouseScroll', wheel, false);}
    window.onmousewheel = document.onmousewheel = wheel;
