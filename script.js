// https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/


$("document").ready(function() {

	var sounds = {
		"green": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
		"red": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
		"yellow": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
		"blue": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
		"wrong": new Audio("http://www.orangefreesounds.com/wp-content/uploads/2015/08/Error-sound-effect.mp3")    
	};

	var lightOn = {
		"green": "#7ec66b",
		"red": "#f64d48",
		"yellow": "#fad553",
		"blue": "#5eb5b6",
	};

	var lightOff = {
		"green": "#285c1b",
		"red": "#c21813",
		"yellow": "#d9b44c",
		"blue": "#316c6d",
	};

	var step = 0;
	var count = 1;
	var playerInput = [];
	var pattern = [];
	var clickablePad = false;
	var strictMode = false;
	var wrongInput = false;
	


	// pad event handler
	$(".pad").on("click", function() {
		if (clickablePad) {
			var padID = $(this).attr("id");
			playerInput.push(padID);

			checkPlayerInput();		
			switchLight(padID);

			wrongInput ? sounds["wrong"].play() : sounds[padID].play();
		}

	});


	// start game when Start Button is clicked
	$("#startBtn").on("click", function() {
		updateStep();
		startPattern();
	});


	// switch Strict mode when the Strict Button is clicked
	$("#strictBtn").on("click", function() {
		strictMode = !strictMode;
		$(this).toggleClass("strictOff strictOn");
		console.log(strictMode);
	});



	// restart the game
	$("#resetBtn").on("click", function() {
		reset();
		strictMode = false;
	});


	// reset function
	function reset() {
		step = 0;
		count = 1;
		playerInput = [];
		pattern = [];
		strictMode = false;
		wrongInput = false;
		clickablePad = false;
		$(".pad").css("cursor", "initial");			
	}


	// increase step by 1 and update its display every time the function is called
	// if step < 20, keep going. It step is > 20, announce that the player has won
	function updateStep() {
		if (step < 20) {
			step++;
			$(".circle h3").text(step + "/20");
		} else {
			$(".circle h3").text("You made it!");
		}		
	}



	function playSound() {
		var i = 0;		
		var key = pattern[i];
		clickablePad = false;     // make pad unclickable
		
		(function theLoop(i) {
		  setTimeout(function() {
		    sounds[key].play();
		    switchLight(key);

		    if (i < pattern.length - 1) {	    		        
		      	i++; 	// If i < pattern' length, keep going
		      	key = pattern[i];
		      	theLoop(i);       // Call the loop again, and pass it the new value of i
		    } else {
		    	// after the pattern has played completely, make tha pads clickable
		    	clickablePad = true;
		    	$(".pad").css("cursor", "pointer");	
		    }		    
		  }, 1200);

		  	  		  
		})(0);		
	}


	function switchLight(key) {		
		$("#" + key).css("backgroundColor", lightOn[key]);

		setTimeout(function() {
			$("#" + key).css("backgroundColor", lightOff[key]);
		}, 600);		
	}


	// choose random pad
	function generatePattern() {
		var arr = ["green", "red", "yellow", "blue"];
		var random = Math.floor( Math.random() * 4);

		pattern.push(arr[random]);
		console.log(pattern);
	}


	// start running a pattern of buttons
	function startPattern() {	
		while (count <= step) {
			generatePattern();
			playSound();
			
			playerInput = [];
			count++;
		}
	}
	

	// pass in a function and delay duration to solve the "setTimeout in loop" problem
	function delay(func, time) {
		setTimeout(function() {
			func();
		}, time);
	}


	// check player input
	function checkPlayerInput() {		
		for (var i = 0; i < playerInput.length; i++) {
			// if player input wrong pad and strict mode is ON, start the game over
			if (playerInput[i] !== pattern[i]) {
				wrongInput = true; // switch this variable to disable the sound of the incorrect pad

				if (strictMode) {
					console.log("Strict mode ON & wrong input: " + playerInput);			    
					delay(reset, 1000);	
					delay(updateStep, 1000);
					delay(startPattern, 1000);					
					return;
				}
				// if player input wrong pad and strict mode is OFF, replay the pattern
				else {
					console.log("Strict mode OFF & wrong input: " + playerInput);
					playerInput = [];
					clickablePad = false;
					$(".pad").css("cursor", "initial");
					delay(playSound, 1000);
					return;
				}
				
			}			
		}

		wrongInput = false; // switch back to false to enable the sound of the correct pad

		// if player input correctly, move up 1 step
		if (playerInput.length === pattern.length) {
			clickablePad = false;
			$(".pad").css("cursor", "initial");		
			delay(updateStep, 1000);
			delay(startPattern, 1000);
		}
	}
	
});