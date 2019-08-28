const MessageBoard = require('../models/messageBoard');
const Thread = require('../models/thread.js').Thread;
const Reply = require('../models/reply.js').Reply;

module.exports = function() {

  this.getRepliesFromThread = async(boardId, threadId) => {
    var result;
    try {
      var mb = await MessageBoard.findById(boardId).exec();
      if (!mb) {
        result = {notFound: 'Message Board not found!'};
      } else {
        var foundIndex;
        for(var i = 0; i < mb.threads.length; ++i) {
          if(mb.threads[i]._id == threadId) {
            foundIndex = i;
            break;
          }
        }

        if (typeof foundIndex === 'number') {
          var replies = mb.threads[foundIndex].replies;
          replies.forEach((reply) => {
            delete reply.delete_password;
            delete reply.reported;
          });

          result = {replies: replies};
        } else {
          result = {notFound: 'Thread not found!'};
        }
      }

      return result;
    } catch(err) {
      console.log("getRepliesFromThread err:", err);
      return null;
    }
  }

  this.addReplyToThread = async(boardId, threadId, text, delete_password) => {
    var result;
    try {
      var mb = await MessageBoard.findById(boardId).exec();
      if (!mb) {
        result = {notFound: 'Message Board not found!'};
      } else {
        var foundIndex;
        for(var i = 0; i < mb.threads.length; ++i) {
          if(mb.threads[i]._id == threadId) {
            foundIndex = i;
            break;
          }
        }

        if (typeof foundIndex === 'number') {
          var currentDate = new Date().toLocaleString();
          var newReply = new Reply({
            text,
            delete_password,
            created_on: currentDate
          });

          mb.threads[foundIndex].replies.push(newReply);
          mb.threads[foundIndex].bumped_on = currentDate;

          await mb.save();
          result = {'reply': newReply};
        } else {
          result = {notFound: 'Thread not found!'};
        }
      }

      return result;
    } catch(err) {
      console.log("addReplyToThread err:", err);
      return null;
    }
  }

  this.deleteReplyFromThread = async(boardId, threadId, replyId, delete_password) => {
    var result;
    try {
      var mb = await MessageBoard.findById(boardId).exec();
      if (!mb) {
        result = {notFound: 'Message Board not found!'};
      } else {
        var thread = mb.threads.find((thread) => {
          return thread._id == threadId;
        });

        if (thread) {
          var wasDeleted = false;
          var reply = thread.replies.find((reply) => {
            if (reply._id == replyId && reply.delete_password === delete_password) {
              reply.text = '[deleted]';
              wasDeleted = true;
            }
            return reply._id == replyId;
          });

          if (reply) {
            if (wasDeleted) {
              await mb.save();
              result = {success: 'Reply successfully deleted'};
            } else {
              result = {incorrectPassword: 'Password Incorrect'};
            }
          } else {
            result = {notFound: 'Reply not found!'};
          }

        } else {
          result = {notFound: 'Thread not found!'};
        }
      }

      return result;
    } catch(err) {
      console.log("deleteReplyFromThread err:", err);
      return null;
    }
  }

  this.reportReply = async(boardId, threadId, replyId) => {
    var result;
    try {
      var mb = await MessageBoard.findById(boardId).exec();
      if (!mb) {
        result = {notFound: 'Message Board not found!'};
      } else {
        var foundThreadIndex;
        for(var i = 0; i < mb.threads.length; ++i) {
          if(mb.threads[i]._id == threadId) {
            foundThreadIndex = i;
            break;
          }
        }

        if (typeof foundThreadIndex === 'number') {
          var foundReplyIndex;
          for(var i = 0; i < mb.threads[foundThreadIndex].replies.length; ++i) {
          if(mb.threads[foundThreadIndex].replies[i]._id == replyId) {
            foundReplyIndex = i;
            break;
          }
        }

        if(typeof foundReplyIndex === 'number') {
          mb.threads[foundThreadIndex].replies[foundReplyIndex].reported = true;
          await mb.save();
          result = {reply: mb.threads[foundThreadIndex].replies[foundReplyIndex]};
        } else {
          result = {notFound: 'Reply not found!'};
        }

      } else {
        result = {notFound: 'Thread not found!'};
        }
      }
      return result;

    } catch(err) {
      console.log("reportThread err:", err);
      return null;
    }
  }
}
