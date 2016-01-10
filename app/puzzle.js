/*
 * Generate the puzzle array
 */
function generatePuzzleArray() {
    var array = [1,2,3,4,5,6,7,8];
    array = shuffle( array );
    return array;
}

/*
 * Shuffle the elements of an array randomly
 */
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


exports.generatePuzzleArray = generatePuzzleArray;
