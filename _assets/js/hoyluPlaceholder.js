var hoyluPlaceholder = (function() {
  
  var
    // module
    $module = $("[data-module]"),

    // arrays
    $lines = $module.find("[data-line]"),    
    $piecesBackLow = $module.find("[data-piece=backLow]"),
    $piecesBackUp = $module.find("[data-piece=backUp]"),
    $piecesFrontUp = $module.find("[data-piece=frontUp]"),
    $piecesFrontLow = $module.find("[data-piece=frontLow]"),
    wordArrs = [
      ["INTERACTIVE", "DISRUPTIVE", "GROUNDBREAKING", "NOVEL"],
      ["COMMUNICATION", "RETAIL", "COLLABORATION", "VR", "IOE", "MIXED REALITY"],
      ["HARDWARE", "SOFTWARE", "SOLUTIONS", "CONCEPTS", "EXPERIENCES"]
    ],

    // values
    interval = 4,
    looping
    ;


  // Pre-build settings (only for modern with support)
  if (Modernizr.csstransforms3d) {
    CSSPlugin.defaultTransformPerspective = 500;
    TweenMax.set($piecesBackLow, { rotationX: 90, transformOrigin: "top center" });
    TweenMax.set($piecesFrontUp, { transformOrigin: "bottom center" });
  } else {
    $piecesFrontUp.hide();
    $piecesFrontLow.hide();
  }

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
    looping = setInterval(randomise, interval*1000);
  }
  
  // Randomise
  function randomise() {
    for (var i = 0; i < $lines.length; i++) {
      $line = $($lines[i]);
      // Components to be animated
      $pieceBackLow = $line.find("[data-piece=backLow]");
      $pieceFrontUp = $line.find("[data-piece=frontUp]");
      $overlayBackUp = $line.find("[data-overlay=backUp]");
      $overlayBackLow = $line.find("[data-overlay=backLow]");
      $overlayFrontUp = $line.find("[data-overlay=frontUp]");
      $overlayFrontLow = $line.find("[data-overlay=frontLow]");
      
      // Define timeline for modern with support
      if (Modernizr.csstransforms3d) {
        // Make timeline
        var flipTl = new TimelineMax();
        var delay = i*0.3;
  
        flipTl.to($pieceFrontUp, 1, {rotationX: -90, ease: Power3.easeIn, delay: delay})
              .to($pieceBackLow, 1, {rotationX: 0, ease: Power3.easeOut})
              .call(duplicateWord, [i], this, 2)
              .call(resetStartPos, [i], this, 2.1)
              .call(newWordInBack, [i], this, 2.2);
      } else {
        // Just inject new words for old browsers
        var newWord = wordArrs[i][Math.floor(Math.random()*wordArrs[i].length)];
        $line.find("[data-container=backUp]").html(newWord);
        $line.find("[data-container=backLow]").html(newWord);
      }
    }

    // Duplicating back word to front
    function duplicateWord(i) {
      $line = $($lines[i]);
      $containerBackUp = $line.find("[data-container=backUp]");
      $containerFrontUp = $line.find("[data-container=frontUp]");
      $containerFrontLow = $line.find("[data-container=frontLow]");

      $containerFrontUp.html($containerBackUp.html());
      $containerFrontLow.html($containerBackUp.html());
    }

    // Resetting start positions
    function resetStartPos(i) {
      $line = $($lines[i]);
      $pieceBackLow = $line.find("[data-piece=backLow]");
      $pieceFrontUp = $line.find("[data-piece=frontUp]");

      TweenMax.set($pieceBackLow, { rotationX: 90, transformOrigin: "top center" });
      TweenMax.set($pieceFrontUp, { rotationX: 0, transformOrigin: "bottom center" });  
    }

    // Put new word in back
    function newWordInBack(i) {
      $line = $($lines[i]);
      $containerBackUp = $line.find("[data-container=backUp]");
      $containerBackLow = $line.find("[data-container=backLow]");
      $containerFrontUp = $line.find("[data-container=frontUp]");
      var nextWord;
      var prevWord = $containerBackUp.html();

      // Get new - duplicate safe - word
      function getNewWord(){
        var newWord = wordArrs[i][Math.floor(Math.random()*wordArrs[i].length)];        

        if (newWord === prevWord) {
          getNewWord();
        } else {
          nextWord = newWord;
        }
      }

      getNewWord();

      // Inject the word
      $containerBackUp.html(nextWord);
      $containerBackLow.html(nextWord);
    }
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