/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var Book = require('../models/book.js').Book;

chai.use(chaiHttp);

const createTestBook = (done, title, cb) => {
  var newBook = new Book({
    title,
    author: 'John Doe',
    comments: ['first comment', 'second comment'],
    commentcount: 2
  });

  newBook
  .save()
  .then((data) => {
    console.log("Book saved");
    if (cb) cb(data._id);
    done();
  });
}

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'create book object/expect book object'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'create book object/expect book object');
            done();
          });
      });

      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'message');
            assert.equal(res.body.message, 'title is required');
            done();
          });
      });

    });


    suite('GET /api/books => array of books', function(){

      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'commentcount');
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], '_id');
            done();
          });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      var testId;

      before((done) => {
        createTestBook(done, 'test-book', (bookId) => {
          testId = bookId;
        });
      });

      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/' + testId)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, testId);
            assert.equal(res.body.title, 'test-book');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/' + testId)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, testId);
            assert.equal(res.body.title, 'test-book');
            done();
          });
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){

      var testId;

      before((done) => {
        createTestBook(done, 'test-book', (bookId) => {
          testId = bookId;
        });
      });

      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/' + testId)
          .send({
          comment: 'test-comment'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body.comments);
            assert.equal(res.body._id, testId);
            assert.equal(res.body.comments[res.body.comments.length-1], 'test-comment');
            done();
          });
      });

    });

  });

});
