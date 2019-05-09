function telephoneCheck(str) {
  var rgx = /^(1\s?)?(\(\d{3}\)|\d{3})[\-\s]?\d{3}[\-\s]?\d{4}$/;
  return rgx.test(str);
}

telephoneCheck("555-555-5555"); 
