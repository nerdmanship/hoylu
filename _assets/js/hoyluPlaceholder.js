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
    randInt = 4
    ;


  // Pre-build settings
  CSSPlugin.defaultTransformPerspective = 500;
  TweenMax.set($piecesBackLow, { rotationX: 90, transformOrigin: "top center" });
  TweenMax.set($piecesFrontUp, { transformOrigin: "bottom center" });

  // Build
  function build() {
    TweenMax.to($module, 1, {autoAlpha: 1});
    // Insert newWord
    beginLoop();
  }

  // Begin loop
  function beginLoop() {
    setInterval(randomise, randInt*1000);  
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

      // Make timeline
      var flipTl = new TimelineMax();

      // Define timeline
      flipTl.to($pieceFrontUp, 1, {rotationX: -90, ease: Power3.easeIn})
            .to($pieceBackLow, 1, {rotationX: 0, ease: Power3.easeOut})
            .call(duplicateWord, [i], this)
            .call(resetStartPos, [i], this)
            .call(newWordInBack, [i], this);
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

      newWord = wordArrs[i][Math.floor(Math.random()*wordArrs[i].length)];

      $containerBackUp.html(newWord);
      $containerBackLow.html(newWord);
    }
  }
  

  build();
  
  return {
    words: wordArrs,
    lines: $lines,
    build: build
  };

})();




















/*

  // Put a new word in the back container
  function prepNext() {
    var $back1 = $firstLine.find("div[data-piecePos=second-upper] > span");
    var $back2 = $firstLine.find("div[data-piecePos=second-lower] > span");
    var $front1 = $firstLine.find("div[data-piecePos=first-upper] > span");
    var $front2 = $firstLine.find("div[data-piecePos=first-lower] > span");

    var next = words1[Math.floor(Math.random()*words1.length)];
    console.log(next);
    
    $back1.html(next);
    $back2.html(next);
  }
  
  // Play flip animation
  function flip() {

  }

  // Put prev word in front container and reset positions
  function finish() {
    var $back1 = $firstLine.find("div[data-piecePos=second-upper] > span");
    var $back2 = $firstLine.find("div[data-piecePos=second-lower] > span");
    var $front1 = $firstLine.find("div[data-piecePos=first-upper] > span");
    var $front2 = $firstLine.find("div[data-piecePos=first-lower] > span");


    $front1.html($back1.html());
    $front2.html($back1.html());
    //TweenMax.set(pieces, {rotationX: start});
  }*/