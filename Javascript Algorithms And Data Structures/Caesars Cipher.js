function rot13(str) { // LBH QVQ VG!

  let rgx = /[A-Z]/
  return str.split("").map(function(char) {
    if (char.search(rgx) != -1) {
      let charCode = char.charCodeAt(0);

      if (charCode > 77) {                   //char code for M is 77
        return String.fromCharCode(64 + (charCode - 77));
      } else {
        return String.fromCharCode(charCode + 13);
      }
    } else {
      return char;
    }
  }).join("");
}

// Change the inputs below to test
rot13("SERR CVMMN!");
