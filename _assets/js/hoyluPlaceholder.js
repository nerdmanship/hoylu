var hoyluPlaceholder = (function() {
  
  var
    // module
    $module = $("[data-module]"),

    // arrays
    $lines = $module.find("[data-line]"),    
    $piecesBackLow = $module.find("[data-piece=backLow]"),
    $piecesFrontUp = $module.find("[data-piece=frontUp]"),
    wordArrs = [
      ["INTERACTIVE", "DISRUPTIVE", "GROUNDBREAKING", "NOVEL"],
      ["COMMUNICATION", "RETAIL", "COLLABORATION", "VR", "IOE", "MIXED REALITY"],
      ["HARDWARE", "SOFTWARE", "SOLUTIONS", "CONCEPTS", "EXPERIENCES"]
    ],

    // values
    interval = 4,
    looping
    ;


  // Pre-build settings
  CSSPlugin.defaultTransformPerspective = 500;
  TweenMax.set($piecesBackLow, { rotationX: 90, transformOrigin: "top center" });
  TweenMax.set($piecesFrontUp, { transformOrigin: "bottom center" });

  // Build
  function build() {
    for (var i = 0; i < $lines.length; i++) {
      
      frontWord = wordArrs[i][Math.floor(Math.random()*wordArrs[i].length)];
      backWord = wordArrs[i][Math.floor(Math.random()*wordArrs[i].length)];
      
      if (frontWord === backWord) {
        backWord = wordArrs[i][Math.floor(Math.random()*wordArrs[i].length)];
      }

      $($lines[i]).find("[data-container=frontUp]").html(frontWord);
      $($lines[i]).find("[data-container=frontLow]").html(frontWord);

      $($lines[i]).find("[data-container=backUp]").html(backWord);
      $($lines[i]).find("[data-container=backLow]").html(backWord);
    }

    // Center the module
    $module.css({
        'position' : 'absolute',
        'left' : '50%',
        'top' : '50%',
        'margin-left' : -$module.outerWidth()/2,
        'margin-top' : -$module.outerHeight()/2
    });

    TweenMax.to($module, 1, {autoAlpha: 1});
    
    beginLoop();

  }


  // Begin loop
  function beginLoop() {
    if (bowser.firefox || bowser.msedge) {
      looping = setInterval(randomiseNoTransition, interval*1000);
    } else {
      looping = setInterval(randomise, interval*1000);
    }
    
  }
  

  // Randomise WITH transition for modern browsers with support
  function randomise() {
    
    $("#box").html(bowser.name + ' ' + bowser.version + " and this is vanilla");

    for (var i = 0; i < $lines.length; i++) {
      $line = $($lines[i]);
      $pieceFrontUp = $line.find("[data-piece=frontUp]");
      $pieceBackLow = $line.find("[data-piece=backLow]");

      // Make timeline
      var flipTl = new TimelineMax();
      var delay = i*0.2;
      
      // Define timeline
      flipTl.to($pieceFrontUp, 1, {rotationX: -90, ease: Power3.easeIn, delay: delay})
            .to($pieceBackLow, 1, {rotationX: 0, ease: Power3.easeOut})
            .call(copyWord, [i], this, 2.1)
            .call(resetStartPos, [i], this, 2.2)
            .call(newWordInBack, [i], this, 2.3)
            ;
    }
  }


  // Randomise WITHOUT transition for modern browsers with no support
  function randomiseNoTransition() {
    $("#box").html(bowser.name + ' ' + bowser.version + " and this is without transitions");
    
    for (var i = 0; i < $lines.length; i++) {
      
      $line = $($lines[i]);
      $pieceBackUp = $line.find("[data-piece=backUp]");
      $pieceBackLow = $line.find("[data-piece=backLow]");
      $containerFrontUp = $line.find("[data-container=frontUp]");
      $containerFrontLow = $line.find("[data-container=frontLow]");

      $pieceBackUp.hide();
      $pieceBackLow.hide();

      nextWord = updateWord(i, $containerFrontUp);

      $containerFrontUp.html(nextWord);
      $containerFrontLow.html(nextWord);
    }
  }

  // Returns a new word that is not duplicate of word in container
  function updateWord(i, container) {
      
      var prevWord = container.html();
      var newWord = getNewWord(i);

      // Check if new word and previous word are duplicates
      if (!isDuplicate(newWord, prevWord)) { // If not, return new word
        return newWord;
      } else { // If duplicate, re-run function
        return updateWord(i, container);
      }

  }

  // Copy word from back container into the front
  function copyWord(i) {
    $line = $($lines[i]);
    $containerBackUp = $line.find("[data-container=backUp]");
    $containerFrontUp = $line.find("[data-container=frontUp]");
    $containerFrontLow = $line.find("[data-container=frontLow]");

    $containerFrontUp.html( $containerBackUp.html() );
    $containerFrontLow.html( $containerBackUp.html() );
  }


  // Resetting start positions
  function resetStartPos(i) {
    $line = $($lines[i]);
    $pieceBackLow = $line.find("[data-piece=backLow]");
    $pieceFrontUp = $line.find("[data-piece=frontUp]");

    TweenMax.set($pieceBackLow, { rotationX: 90, transformOrigin: "top center" });
    TweenMax.set($pieceFrontUp, { rotationX: 0, transformOrigin: "bottom center" });  
  }


  function getNewWord(i) {
    newWord = wordArrs[i][Math.floor(Math.random()*wordArrs[i].length)];
    return newWord;
  }


  function isDuplicate(newWord, prevWord) {
    return newWord === prevWord;
  }


  // Put new word in back containers
  function newWordInBack(i) {
    $line = $($lines[i]);
    $containerBackUp = $line.find("[data-container=backUp]");
    $containerBackLow = $line.find("[data-container=backLow]");
    $containerFrontUp = $line.find("[data-container=frontUp]");

    // We're gonna assign the next word and push it into the back containers
    var nextWord;

    // Record previous word, whatever is in the back container
    var prevWord = $containerBackUp.html();
    
    // Get a new random word
    var newWord = getNewWord(i);

    // Check if new word and previous word are duplicates
    if (!isDuplicate(newWord, prevWord)) { // If not, update next word and move on
      nextWord = newWord;
    } else { // If so, re-run function and return from this one
      newWordInBack(i);
      return;
    }

    // Inject the next word in back containers
    $containerBackUp.html(nextWord);
    $containerBackLow.html(nextWord);
  }

  
  build();

  
  // Pause if user leaves page
  function killLoop() {
    clearInterval(looping);
    looping = 0;
  }

  function restartLoop() {
    if (!looping){
      beginLoop();
    }
  }

  window.focus();
  $(window).focus(restartLoop);
  $(window).blur(killLoop);

})();


/*
    // Get new - duplicate safe - word
    function getNewWord(){
      var newWord = wordArrs[i][Math.floor(Math.random()*wordArrs[i].length)];

      if (newWord === prevWord) {
        getNewWord();
      } else {
        nextWord = newWord;
      }
    }*/