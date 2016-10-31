// Module in secure namespace
///////////////////////////////////////////////////////////////////////////////
var hoyluPlaceholder = (function() {
  
  // Vars in module scope
  var $module = $("[data-module]"),

    // arrays
    $lines = $module.find("[data-line]"),    
    $piecesBackLow = $module.find("[data-piece=backLow]"),
    $piecesBackUp = $module.find("[data-piece=backUp]"),
    $piecesFrontUp = $module.find("[data-piece=frontUp]"),
    wordArrs = [
      ["INTERACTIVE", "DISRUPTIVE", "GROUNDBREAKING", "NOVEL"],
      ["COMMUNICATION", "RETAIL", "COLLABORATION", "VR", "IOE", "MIXED REALITY"],
      ["HARDWARE", "SOFTWARE", "SOLUTIONS", "CONCEPTS", "EXPERIENCES"]
    ],

    // misc
    interval = 4,
    looping
    ;



  // Pre-build settings
  CSSPlugin.defaultTransformPerspective = 500;
  TweenMax.set($piecesBackLow, { rotationX: 90, transformOrigin: "top center" });
  TweenMax.set($piecesFrontUp, { transformOrigin: "bottom center" });

  // Center the module
  $module.css({
      'position' : 'absolute',
      'left' : '50%',
      'top' : '50%',
      'margin-left' : -$module.outerWidth()/2,
      'margin-top' : -$module.outerHeight()/2
  });

  // Inject random words in front and back containers
  for (var i = 0; i < $lines.length; i++) {
      
      // Get random words for front containers
      frontWord = wordArrs[i][Math.floor(Math.random()*wordArrs[i].length)];
      
      // Inject in front containers      
      $($lines[i]).find("[data-container=frontUp]").html(frontWord);
      $($lines[i]).find("[data-container=frontLow]").html(frontWord);

      // Prepare to check contents of this container
      $container = $($lines[i]).find("[data-container=frontUp]");
      
      // Get random duplicate safe words for back containers
      backWord = updateWord(i, $container);

      // Inject in back containers
      $($lines[i]).find("[data-container=backUp]").html(backWord);
      $($lines[i]).find("[data-container=backLow]").html(backWord);
    }

  // MSIE8 fallback
  if (bowser.msie && (bowser.version == "8.0")) {
    MSIE8Fallback();
  }



  // Reveal and start loop
  function reveal() {

    if (bowser.msie || bowser.msedge) {

      // Hide obsolete containers
      $piecesBackUp.hide();
      $piecesBackLow.hide();

    }

    // Fade in module
    TweenMax.to($module, 1, {autoAlpha: 1});
    
    // Start randomising loop
    beginLoop();

  }

  reveal();



// Branching experience depending on browser support
///////////////////////////////////////////////////////////////////////////////

  // Begin loop
  function beginLoop() {
    if (bowser.msie || bowser.msedge) {
      looping = setInterval(randomiseNoTransition, interval*1000);
    } else {
      looping = setInterval(randomise, interval*1000);
    }
    
  }
  

  // Randomise WITH transition for modern browsers with support
  function randomise() {

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
    var i = 0, iterations = $lines.length;
    function delayLoop() {
        $line = $($lines[i]);
        $pieceBackUp = $line.find("[data-piece=backUp]");
        $pieceBackLow = $line.find("[data-piece=backLow]");
        $containerFrontUp = $line.find("[data-container=frontUp]");
        $containerFrontLow = $line.find("[data-container=frontLow]");

        // Hide obsolete containers
        $pieceBackUp.hide();
        $pieceBackLow.hide();

        // Get a new duplicate safe word
        nextWord = updateWord(i, $containerFrontUp);

        // Update the containers
        $containerFrontUp.html(nextWord);
        $containerFrontLow.html(nextWord);
        
        // add and callback self
        i++;
        if( i < iterations ){
            setTimeout( delayLoop, 100 );
        }
    }
    delayLoop();
  }



// Functions only concerning randomising WITH transition
///////////////////////////////////////////////////////////////////////////////

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


  // Put new word in back containers
  function newWordInBack(i) {
    $line = $($lines[i]);
    $containerBackUp = $line.find("[data-container=backUp]");
    $containerBackLow = $line.find("[data-container=backLow]");
    $containerFrontUp = $line.find("[data-container=frontUp]");

    // Get a new word that is not a duplicate of container
    nextWord = updateWord(i, $containerBackUp);

    // Inject the next word in back containers
    $containerBackUp.html(nextWord);
    $containerBackLow.html(nextWord);
  }

// End of functions only concerning randomising WITH transition



// Functions concerning ALL randomising
///////////////////////////////////////////////////////////////////////////////

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


  // Returns a new word from array[i]
  function getNewWord(i) {
    newWord = wordArrs[i][Math.floor(Math.random()*wordArrs[i].length)];
    return newWord;
  }


  // Check if new and previous words are dublicates
  function isDuplicate(newWord, prevWord) {
    return newWord === prevWord;
  }

// End of functions concerning ALL randomising

  
  // MSIE8 Fallback
  function MSIE8Fallback() {

    // Grab the logo
    var logo = document.querySelector("[data-logo]");

    // Remove bg image
    logo.style.backgroundImage = "none";

    // Inject image tag instead
    innerHTML = "<img src =  ></img>";
    var img = document.createElement("img");
    img.src = "../img/hoylu_logo@2x.png";
    img.style.width = "90px";
    logo.appendChild(img);
    
    // Grab the lines and pieces
    var lines = document.querySelectorAll("[data-line]");
    var pieces = document.querySelectorAll("[data-piece=backLow]");

    // Hide all backlows and inject words in containers
    for (var j = 0; j < lines.length; j++) {
      // Hide backLow pieces
      pieces[j].style.display = "none";

      // Inject unique word per line
      for (var k = 0; k < pieces.length; k++) {
        lines[j].querySelectorAll("[data-container]")[k].innerHTML = wordArrs[j][0];  
      }
    }
  }
  
  

  
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

  return {
    msie: MSIE8Fallback
  };

})();