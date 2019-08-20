const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Stock = require('../models/stock.js').Stock;

module.exports = function() {

  var url = new URL('https://www.alphavantage.co/query');
  url.searchParams.set('function', 'GLOBAL_QUOTE');
  url.searchParams.set('apikey', process.env.API_KEY);

  this.fetchStockData = (stock) => {
    url.searchParams.set('symbol', stock);
    var request = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      request.onreadystatechange = () => {
        if (request.readyState !== 4) return;

        if (request.status >= 200 && request.status < 300) {
          var data = JSON.parse(request.responseText);
          resolve(data);
        } else {
          reject({status: request.status});
        }
      }

      request.open('GET', url.toString(), true);
      request.send();
    });
  }

  this.updateStock = async(stockTick, price, ip, isLiked) => {
    var stock = await Stock.findOne({stock: stockTick}).exec();

    if (stock) {
      if (!stock.ipAddresses.includes(ip) && isLiked) {
        stock.likes += 1;
        stock.ipAddresses.push(ip);
      }
      stock.price = price.toString();
      await stock.save();

    } else {
      var newStock = new Stock({
        stock: stockTick,
        price: price.toString(),
        likes: isLiked ? 1 : 0,
        ipAddresses: isLiked ? [ip] : []
      });

      await newStock.save();
      stock = newStock;
    }

    return stock;
  }

  this.getStocks = async(stockTickers, ip, liked) => {
    var needsWait = null;
    var stockPrices = [];

    for (var ticker of stockTickers) {
      var stock = await this.fetchStockData(ticker);
      if (stock.hasOwnProperty('Note')) {
        // API limit reached
        needsWait = stock;
        break;
      } else {
        stockPrices.push(stock['Global Quote']['05. price']);
      }
    }

    if (needsWait) {
      return needsWait;
    }

    var updatedStocks = [];
    for (var i = 0; i < stockTickers.length; i++) {
      if (!stockPrices[i]) {
        updatedStocks = null;
        break;
      }

      var updatedStock = await this.updateStock(stockTickers[i], stockPrices[i], ip, liked);
      updatedStocks.push(updatedStock);
    }

    return updatedStocks;
  }
}
