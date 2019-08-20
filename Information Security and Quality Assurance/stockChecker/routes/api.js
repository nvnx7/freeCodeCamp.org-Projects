/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var StockController = require('../controllers/stockController.js');
var Stock = require('../models/stock.js').Stock;

module.exports = function (app) {

  const stockController = new StockController();

  app.route('/api/stock-prices')

    .get(function (req, res){
      var queryStock = req.query.stock;
      var queryLike = req.query.like;
      var stocks;

      if (Array.isArray(queryStock)) {
        stocks = [queryStock[0].toUpperCase(), queryStock[1].toUpperCase()];
      } else {
        stocks = [queryStock.toUpperCase()];
      }

      var stocks = stockController.getStocks(stocks, req.ip, queryLike)
      .then((stocks) => {

        if (stocks) {
          if (stocks.hasOwnProperty('Note')) {
            res.json({error: "Please wait 1 minute before making next request."});
            return;
          }

          var stockData;
          if (stocks.length == 1) {
            stockData = {
              stock: stocks[0].stock,
              price: stocks[0].price,
              likes: stocks[0].likes
            }
          } else {
            stockData = [];
            var relLikes = [stocks[0].likes - stocks[1].likes,
                            stocks[1].likes - stocks[0].likes];

            for (var i = 0; i < stocks.length; i++) {
              stockData.push({
                stock: stocks[i].stock,
                price: stocks[i].price,
                rel_likes: relLikes[i]
              });
            }
          }

          res.json({stockData});
        } else {
          res.json({error: "Error! Please check for valid stock ticker."});
        }

      });
    });

};
