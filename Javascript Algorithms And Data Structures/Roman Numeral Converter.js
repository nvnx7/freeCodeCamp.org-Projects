function convertToRoman(num) {
    let decimal = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    let roman = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];

    let remain = num;
    let fragStr = "";

    for (let i in decimal) {

        if (remain == 0) {
            break;
        }

        let numStr = "+".concat(decimal[i].toString());
        fragStr = fragStr
        .concat(numStr.repeat(remain/decimal[i]));

        remain = remain%decimal[i];
    }

    return fragStr.split("+").slice(1,).map(function(d) {
        return roman[decimal.indexOf(parseInt(d))];
    }).reduce(function(t, n) {
        return t + n;
    });
}

convertToRoman(4);
