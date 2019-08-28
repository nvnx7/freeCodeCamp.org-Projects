/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const BoardController = require('../controllers/boardController.js');
const ThreadController = require('../controllers/threadController.js');
const ReplyController = require('../controllers/replyController.js');

module.exports = function (app) {

  const boardController = new BoardController();
  const threadController = new ThreadController();
  const replyController = new ReplyController();

  app.route('/api/boards')

  .get((req, res) => {
    boardController.getAllMessageBoards()
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.json({error: "Error Occurred!"});
      }
    });
  })

  .post((req, res) => {
    var title = req.body.board_title;
    var deletePassword = req.body.delete_password;

    console.log("req body", req.body);

    boardController.addNewMessageBoard(title, deletePassword)
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.json({error: "Error Occurred!"});
      }
    })
  })

  .delete((req, res) => {
    var id = req.body.board_id;
    var deletePassword = req.body.delete_password;

    boardController.deleteMessageBoard(id, deletePassword)
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.json({error: "Error Occurred! Please check inputs"});
      }

    });
  });

  app.route('/api/boards/:boardId')

  .get((req, res) => {
    var boardId = req.params.boardId;
    boardController.getMessageBoard(boardId)
    .then((result) => {
      if (result) {
        result.board.threads.sort((t1, t2) => {
          if (new Date(t1.bumped_on) < new Date(t2.bumped_on)) {
            return 1;
          } else {
            return -1;
          }
        });
        res.json(result);
      } else {
        res.json({error: "Error Occurred!"});
      }
    });
  });

  app.get('/api/threads/:boardId/:threadId', (req, res) => {
    var boardId = req.params.boardId;
    var threadId = req.params.threadId;

    threadController.getThreadFromBoard(boardId, threadId)
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.json({error: "Error Occurred! Please check inputs"});
      }
    })
  });

  app.route('/api/threads/:boardId')

  .get((req, res) => {
    var boardId = req.params.boardId;

    threadController.getAllThreadsFromBoard(boardId)
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.json({error: "Error Occurred! Please check inputs"});
      }
    });
  })

  .post((req, res) => {
    var boardId = req.params.boardId;
    var text = req.body.text;
    var deletePassword = req.body.delete_password;

    threadController.addThreadToBoard(boardId, text, deletePassword)
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.json({error: "Error Occurred! Please check inputs"});
      }
    });
  })

  .put((req, res) => {
    var boardId = req.params.boardId;
    var threadId = req.body.thread_id;

    threadController.reportThread(boardId, threadId)
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.json({error: "Error Occurred! Please check inputs"});
      }
    });
  })

  .delete((req, res) => {
    var boardId = req.params.boardId;
    var threadId = req.body.thread_id;
    var deletePassword = req.body.delete_password;

    threadController.deleteThreadFromBoard(boardId, threadId, deletePassword)
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.json({error: "Error Occurred! Please check inputs"});
      }
    });
  });

  app.route('/api/replies/:boardId')

  .get((req, res) => {
    var boardId = req.params.boardId;
    var threadId = req.query.thread_id;
    console.log("Thread id api received", threadId.toString());
    replyController.getRepliesFromThread(boardId, threadId)
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.json({error: "Error Occurred! Please check inputs"});
      }
    })
  })

  .post((req, res) => {
    var boardId = req.params.boardId;
    var threadId = req.body.thread_id;
    var text = req.body.text;
    var deletePassword = req.body.delete_password;

    console.log("body of req", req.body);

    replyController.addReplyToThread(boardId, threadId, text, deletePassword)
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.json({error: "Error Occurred! Please check inputs"});
      }
    });
  })

  .put((req, res) => {
    var boardId = req.params.boardId;
    var threadId = req.body.thread_id;
    var replyId = req.body.reply_id;

    replyController.reportReply(boardId, threadId, replyId)
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.json({error: "Error Occurred! Please check inputs"});
      }
    });
  })

  .delete((req, res) => {
    var boardId = req.params.boardId;
    var threadId = req.body.thread_id;
    var replyId = req.body.reply_id;
    var deletePassword = req.body.delete_password;

    replyController.deleteReplyFromThread(boardId, threadId, replyId, deletePassword)
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.json({error: "Error Occurred! Please check inputs"});
      }
    });
  });

};
