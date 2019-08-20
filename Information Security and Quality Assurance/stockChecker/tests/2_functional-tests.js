/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

// NOTE: These test pass when test one by one, however not all at once. This is
// because of limitations of free API call used (5 per minute). Using 2 stocks require
// 2 API calls.
suite('Functional Tests', function() {

    suite('GET /api/stock-prices => stockData object', function() {

      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.equal(res.body.stockData.stock, 'GOOG');
          done();
        });
      });

      test('1 stock with like', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({
         stock: 'goog',
         like: true
       })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.property(res.body.stockData, 'price');
          assert.equal(res.body.stockData.stock, 'GOOG');
          assert.equal(res.body.stockData.likes, 1);
          done();
        });
      });

      test('1 stock with like again (ensure likes arent double counted)', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({
         stock: 'goog',
         like: true
       })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.property(res.body.stockData, 'price');
          assert.equal(res.body.stockData.stock, 'GOOG');
          assert.equal(res.body.stockData.likes, 1);
          done();
        });
      });

      test('2 stocks', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({
         stock: ['goog', 'msft']
       })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.isArray(res.body.stockData);
          assert.property(res.body.stockData[0], 'price');
          assert.property(res.body.stockData[1], 'price');
          assert.property(res.body.stockData[0], 'rel_likes');
          assert.property(res.body.stockData[1], 'rel_likes');
          assert.equal(res.body.stockData[0].stock, 'GOOG');
          assert.equal(res.body.stockData[1].stock, 'MSFT');
          done();
        });
      });

      test('2 stocks with like', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({
         stock: ['goog', 'msft'],
         like: true
       })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.isArray(res.body.stockData);
          assert.property(res.body.stockData[0], 'price');
          assert.property(res.body.stockData[1], 'price');
          assert.equal(res.body.stockData[0].stock, 'GOOG');
          assert.equal(res.body.stockData[1].stock, 'MSFT');
          done();
        });
      });

    });

});
