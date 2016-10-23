//-----------------------------------
// HELPER FUNCTIONS -----------------
//-----------------------------------

var select = function(s) { return document.querySelector(s); };
var selectAll = function(s) { return document.querySelectorAll(s); };

// Function to return random number between given range
function random(min, max) {
  if (max === null) { max = min; min = 0; }
  return Math.random() * (max - min) + min;
}

function chanceRoll(chance) {
  if (chance === null) { chance = 50; }
  return chance > 0 && Math.random() * 100 <= chance;
}

//-----------------------------------
// END OF HELPER FUNCTIONS ----------
//-----------------------------------