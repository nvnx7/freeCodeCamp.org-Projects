/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var Book = require('../models/book.js').Book;

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.find({}, (err, books) => {
        if (err) {
          console.log("Error:", err);
        } else {
          res.json(books);
        }
      });
    })

    .post(function (req, res){
      var title = req.body.title ? req.body.title.trim() : req.body.title;
      var bookAuthor = req.body.author ? req.body.author.trim() : req.body.author;

      if (title) {
        var newBook = new Book({
          title,
          author: bookAuthor ? bookAuthor : ""
        });

        newBook
        .save()
        .then((data) => {
          res.json(data);
        });
      } else {
        res.send({message: 'title is required'});
      }

    })

    .delete(function(req, res){
      Book.deleteMany({}, (err) => {
        if (err) {
          console.log("Error:", err);
        } else {
          res.json({message: 'complete delete successful'});
        }
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;

      Book.findById(bookid, (err, book) => {
        if (err) {
          console.log("Error:", err);
        } else {
          res.json(book);
        }
      });
    })

    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;

      Book.findById(bookid, (err, book) => {
        if (err) {
          console.log("Error:", err);
        } else {
          book.comments.push(comment);
          book.commentcount += 1;
          book
          .save()
          .then((data) => {
            res.json(data);
          });
        }
      });

    })

    .delete(function(req, res){
      var bookid = req.params.id;

      Book.findOneAndRemove({_id: bookid}, (err, book) => {
        if (err) {
          console.log("Error:", err);
        } else {

          if (book) {
            res.json({message: "delete successful"});
          } else {
            res.json({message: "id not found"});
          }
        }
      });

    });

};
