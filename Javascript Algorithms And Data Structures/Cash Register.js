function checkCashRegister(price, cash, cid) {

  let changeDue = cash - price;
  let change = [];
  let currencies = [["PENNY", 0.01], ["NICKEL", 0.05], ["DIME", 0.1], ["QUARTER", 0.25],      ["ONE", 1], ["FIVE", 5], ["TEN", 10], ["TWENTY", 20], ["ONE HUNDRED", 100]];

  let totalCashInRegister = cid.map(function(currency) {
    return currency[1];
  }).reduce(function(total, current) {
    return total + current;
  });

  totalCashInRegister = (totalCashInRegister*100)/100;

  if (totalCashInRegister < changeDue) {
    return {"status": "INSUFFICIENT_FUNDS", "change": change};
  } else if (totalCashInRegister == changeDue) {
    return {"status": "CLOSED", "change": cid};
  }

  let changeChecked = changeDue;
  let status = "OPEN";
  for (let i = currencies.length - 1; i >= 0; i--) {
    if (changeChecked <= 0) {
      console.log("Done.");
      break;
    }

    let numNeeded = Math.floor(changeChecked/currencies[i][1]);
    let numAvailable = cid[i][1]/currencies[i][1];
    let numTaken = 0;
    if (numNeeded == 0) {
      numTaken = numNeeded;
    } else if (numAvailable < numNeeded) {
      numTaken = numAvailable;
    } else {
      numTaken = numNeeded;
    }

    if (numTaken != 0) {
      change = change.concat([[
        currencies[i][0], currencies[i][1]*numTaken
      ]]);

      changeChecked = Math.round((changeChecked - currencies[i][1]*numTaken)*100)/100;
    }

  }

  if (changeChecked != 0) {
    return {"status": "INSUFFICIENT_FUNDS", "change": []};
  }

  return {"status": "OPEN", "change": change};
}

// Example cash-in-drawer array:
// [["PENNY", 1.01],
// ["NICKEL", 2.05],
// ["DIME", 3.1],
// ["QUARTER", 4.25],
// ["ONE", 90],
// ["FIVE", 55],
// ["TEN", 20],
// ["TWENTY", 60],
// ["ONE HUNDRED", 100]]

checkCashRegister(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 1], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]);
