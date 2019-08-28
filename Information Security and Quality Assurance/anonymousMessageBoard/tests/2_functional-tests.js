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

const MessageBoard = require('../models/messageBoard');
const Thread = require('../models/thread.js').Thread;
const Reply = require('../models/reply.js').Reply;

const BoardController = require('../controllers/boardController.js');
const ThreadController = require('../controllers/threadController.js');
const ReplyController = require('../controllers/replyController.js');

chai.use(chaiHttp);

const createTestMessageBoard = (boardTitle, threadText, replyText, cb, done) => {
  const boardController = new BoardController();

  MessageBoard.findOne({title: boardTitle}, (err, mb) => {
    if (err) {
      console.log("error creating test board", err);
      done();
    } else {
      var date = new Date().toLocaleString();
      var newThread = {
        text: threadText,
        created_on: date,
        bumped_on: date,
        delete_password: 'testDeletePassword',
        replies: []
      }

      var newReply = {
        text: replyText,
        created_on: date,
        delete_password: 'testDeletePassword'
      }

      newThread.replies.push(newReply);

      if (mb) {
        console.log("test mb already found");
        mb.threads.push(newThread);
        mb.save()
        .then((data) => {
          if (cb) {
            var threadId = data.threads[data.threads.length-1]._id;
            var replyIdx = data.threads[data.threads.length-1].replies.length - 1;
            var replyId = data.threads[data.threads.length-1].replies[replyIdx]._id;

            cb(data._id, threadId, replyId);
          }
          done();
        });
      } else {
        console.log("creating test mb...");
        var newMb = new MessageBoard({
          title: boardTitle,
          threads: [],
          delete_password: 'testDeletePassword'
        });

        newMb.threads.push(newThread);
        newMb.save()
        .then((data) => {
          if (cb) {
            var threadId = data.threads[data.threads.length-1]._id;
            var replyIdx = data.threads[data.threads.length-1].replies.length - 1;
            var replyId = data.threads[data.threads.length-1].replies[replyIdx]._id;

            cb(data._id, threadId, replyId);
          }
          done();
        });
      }
    }
  })
}

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:boardId', function () {

    var testBoardId;
    var testThreadId;
    var testReplyId;

    before((done) => {
      createTestMessageBoard('test', 'testThreadText', 'testReplyText',
                             (boardId, threadId, replyId) => {
        testBoardId = boardId.toString();
        testThreadId = threadId.toString();
        testReplyId = replyId.toString();
      }, done);
    });

    test('POST', function(done) {
      chai.request(server)
        .post('/api/threads/' + testBoardId)
        .send({
          text: 'testThreadText',
          delete_password: 'testPassword'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'thread');
          assert.equal(res.body.thread.text, 'testThreadText');
          assert.equal(res.body.thread.delete_password, 'testPassword');

          done();
        });

    });

    test('GET', function(done) {
      chai.request(server)
        .get('/api/threads/' + testBoardId)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'threads');
          assert.isArray(res.body.threads);
          assert.property(res.body.threads[0], '_id');
          assert.property(res.body.threads[0], 'text');
          assert.property(res.body.threads[0], 'created_on');
          assert.property(res.body.threads[0], 'bumped_on');
          assert.property(res.body.threads[0], 'replies');
          done();
        });
    });

    test('PUT', function(done) {
      chai.request(server)
        .put('/api/threads/' + testBoardId)
        .send({
          thread_id: testThreadId
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'thread');
          assert.equal(res.body.thread._id, testThreadId.toString());
          assert.isTrue(res.body.thread.reported);

          done();
        });
    });

    test('DELETE', function(done) {
      chai.request(server)
        .delete('/api/threads/' + testBoardId)
        .send({
          thread_id: testThreadId,
          delete_password: 'testDeletePassword'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'success');

          done();
        });
    });

  });


  suite('API ROUTING FOR /api/replies/:board', function() {

    var testBoardId;
    var testThreadId;
    var testReplyId;

    before((done) => {
      createTestMessageBoard('test', 'testThreadText', 'testReplyText',
                             (boardId, threadId, replyId) => {
        testBoardId = boardId.toString();
        testThreadId = threadId.toString();
        testReplyId = replyId.toString();
      }, done);
    });

    test('POST', function(done) {
      chai.request(server)
        .post('/api/replies/' + testBoardId)
        .send({
          thread_id: testThreadId,
          text: 'testReplyText',
          delete_password: 'testPassword'
        })
       .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'reply');
          assert.equal(res.body.reply.text, 'testReplyText');
          assert.equal(res.body.reply.delete_password, 'testPassword');

          done();
      });
    });

    test('GET', function(done) {
      chai.request(server)
        .get('/api/replies/' + testBoardId)
        .query({
          thread_id: testThreadId
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'replies')
          assert.isArray(res.body.replies);
          assert.property(res.body.replies[0], 'text');
          assert.property(res.body.replies[0], 'created_on');
          done();
        });
    });

    test('PUT', function(done) {
      chai.request(server)
        .put('/api/replies/' + testBoardId)
        .send({
          thread_id: testThreadId,
          reply_id: testReplyId
        })
       .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'reply');
          assert.isTrue(res.body.reply.reported);

          done();
      });
    });

    test('DELETE', function(done) {
      chai.request(server)
        .delete('/api/threads/' + testBoardId)
        .send({
          thread_id: testThreadId,
          reply_id: testReplyId,
          delete_password: 'testDeletePassword'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'success');

          done();
        });
    });

  });

});
