/*
*
*
*       Complete the handler logic below
*
*
*/

function ConvertHandler() {

  this.getNum = function(input) {
    var result;
    var unitPatt = /[a-zA-Z]+$/gi;
    var idx = input.search(unitPatt);
    if (idx === -1) {
      if (isNaN(input)) {
        return null;
      } else {
        return Math.round(Number(eval(input))*100000)/100000;
      }
    }

    var numPart = idx === 0 ? 1 : input.slice(0, idx);
    console.log('numPart:', numPart);

    try {
      result = Math.round(eval(numPart)*100000)/100000;
    } catch(err) {
      return null;
    }

    return result;
  };

  this.getUnit = function(input) {
    var result;
    var unitPatt = /(km|mi|kg|lbs|gal|l)+$/gi
    var match = input.match(unitPatt); //could be null
    if (match == null) {
      return null;
    }

    result = input.match(unitPatt)[0];

    return result;
  };

  this.getReturnUnit = function(initUnit) {
    var result;
    switch(initUnit.toLowerCase()) {
      case 'gal':
        result = 'L';
        break;
      case 'l':
        result = 'gal';
        break;
      case 'mi':
        result = 'km';
        break;
      case 'km':
        result = 'mi';
        break;
      case 'lbs':
        result = 'kg';
        break;
      case 'kg':
        result = 'lbs';
        break;
    }
    return result;
  };

  this.spellOutUnit = function(unit) {
    var result;
    switch(unit.toLowerCase()) {
      case 'gal':
        result = 'gallon';
        break;
      case 'l':
        result = 'litre';
        break;
      case 'mi':
        result = 'mile';
        break;
      case 'km':
        result = 'kilometer';
        break;
      case 'lbs':
        result = 'pound';
        break;
      case 'kg':
        result = 'kilogram';
        break;
    }
    return result;
  };

  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;

    var result;
    var returnUnit = this.getReturnUnit(initUnit);

    switch(initUnit.toLowerCase()) {
      case 'gal':
        result = Math.round((initNum*galToL)*100000)/100000;
        break;
      case 'l':
        result = Math.round((initNum/galToL)*100000)/100000;
        break;
      case 'mi':
        result = Math.round((initNum*miToKm)*100000)/100000;
        break;
      case 'km':
        result = Math.round((initNum/miToKm)*100000)/100000;
        break;
      case 'lbs':
        result = Math.round((initNum*lbsToKg)*100000)/100000;
        break;
      case 'kg':
        result = Math.round((initNum/lbsToKg)*100000)/100000;
        break;
    }
    return result;
  };

  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    var result = `${initNum} ${initUnit} converts to ${returnNum} ${returnUnit}`;
    return result;
  };

}

module.exports = ConvertHandler;
