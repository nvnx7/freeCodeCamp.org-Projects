function palindrome(str) {
  // Good luck!
  let pat = /[^a-zA-Z0-9]|/gi
  let simpleStr = str.split(pat).join("").toLowerCase();

  return (simpleStr == simpleStr.split("").reverse().join(""));
}

palindrome("eye");
