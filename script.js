// REFERENCE: https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/


$("document").ready(function() {

  var sounds = {
    "green": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
    "red": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
    "yellow": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
    "blue": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
    "wrong": new Audio("http://www.orangefreesounds.com/wp-content/uploads/2015/08/Error-sound-effect.mp3")
  };

  var lightOn = {
    "green": "#8acb79",
    "red": "#f65e5a",
    "yellow": "#fad96f",
    "blue": "#6ebcbd",
  };

  var lightOff = {
    "green": "#285c1b",
    "red": "#ae1511",
    "yellow": "#d0ae48",
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
    $(this).text("Restart");  // change text to Restart

    if (step !== 0) {
      reset();
      strictMode = false;
    }

    updateStep();
    startPattern();
  });


  // switch Strict mode when the Strict Button is clicked
  $("#strictBtn").on("click", function() {
    strictMode = !strictMode;
    $(this).toggleClass("strictOff strictOn");

    if (strictMode === true) {
      $(this).css({ "border": "2px solid #dbd5c5", "color": "#dbd5c5"});
    } else {
      $(this).css({ "border": "none", "color": "#999" });
    }
    console.log("strict mode: " + strictMode);
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
    if (step < 9) {
      step++;
      $("h2").text("0" + step + "/20");
      if ($("h2").text !== "0/20") {
        $("h2").css('color', '#e5e5e5');
      }
    } else if (step >= 9 && step < 20) {
      step++;
      $("h2").text(step + "/20");
    } else {
      $("h2").text("You made it!");
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
            i++;  // If i < pattern' length, keep going
            key = pattern[i];
            theLoop(i);       // Call the loop again, and pass it the new value of i
        } else {
          // after the pattern has finished playing, make tha pads clickable
          clickablePad = true;
          $(".pad").css("cursor", "pointer");
        }
      }, 800);
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
    while (count <= step && step <= 20 ) {  // stop at step 20
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
      // if player clicks the wrong pad and strict mode is ON, start the game over
      if (playerInput[i] !== pattern[i]) {
        wrongInput = true; // switch this variable to disable the sound of the incorrect pad

        if (strictMode) {
          console.log("Strict mode ON & wrong input: " + playerInput);
          delay(reset, 1000);
          delay(updateStep, 1000);
          delay(startPattern, 1000);
          return;
        }
        // if player clicks wrong pad and strict mode is OFF, replay the pattern
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
      console.log("correct input");
      clickablePad = false;
      $(".pad").css("cursor", "initial");
      delay(updateStep, 1000);
      delay(startPattern, 1000);
    }
  }

});
