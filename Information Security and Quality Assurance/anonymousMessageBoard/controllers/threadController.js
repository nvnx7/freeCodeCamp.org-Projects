const MessageBoard = require('../models/messageBoard');
const Thread = require('../models/thread.js').Thread;

module.exports = function() {

  this.getThreadFromBoard = async(boardId, threadId) => {
    var result;
    try {
      var mb = await MessageBoard.findById(boardId).exec();
      if(!mb) {
        result = {notFound: 'Message Board not found!'};
      } else {
        var thread = mb.threads.find((thread) => {
          return thread._id == threadId;
        });

        if (thread) {
          delete thread.delete_password;
          delete thread.reported;
          result = {'thread': thread};
        } else {
          result = {notFound: 'Thread not found!'};
        }
      }

      return result;
    } catch(err) {
      console.log("getThreadFromBoard err:", err);
      return null;
    }
  }

  this.getAllThreadsFromBoard = async(boardId) => {
    var result;
    try{
      var mb = await MessageBoard.findById(boardId).exec();
      if (!mb) {
        result = {notFound: 'Message Board not found!'};
      } else {
        var threads = mb.threads;
        threads.forEach((thread) => {
          delete thread.delete_password;
          delete thread.reported;
        });

        result = {threads: threads};
      }
      return result;
    } catch(err) {
      console.log("getThreadsFromBoard err:", err);
      return null;
    }
  }

  this.addThreadToBoard = async(boardId, text, delete_password) => {
    var result;
    try {
      var mb = await MessageBoard.findById(boardId).exec();
      if (!mb) {
        result = {notFound: 'Message Board not found!'};
      } else {
        var currentDate = new Date().toLocaleString();
        const newThread = new Thread({
          text,
          delete_password,
          created_on: currentDate,
          bumped_on: currentDate
        });

        mb.threads.push(newThread);
        await mb.save();

        result = {'thread': newThread}
      }

      return result;
    } catch(err) {
      console.log("addThreadToBoard err:", err);
      return null;
    }
  }

  this.deleteThreadFromBoard = async(boardId, threadId, delete_password) => {
    var result;
    try {
      var mb = await MessageBoard.findById(boardId).exec();
      if (!mb) {
        result = {notFound: 'Message Board not found!'};
      } else {

        var foundIndex;
        for(var i = 0; i < mb.threads.length; ++i) {
          if(mb.threads[i]._id == threadId) {
            console.log("Index found!", threadId + " " + i);
            foundIndex = i;
            break;
          }
        }

        if(typeof foundIndex === 'number') {
          if(mb.threads[foundIndex].delete_password === delete_password) {
            mb.threads.splice(foundIndex, 1);
            await mb.save();
            result = {success: 'Thread successfully deleted'};
          } else {
            result = {incorrectPassword: 'Password Incorrect'};
          }
        } else {
          result = {notFound: 'Thread not found!'};
        }
      }

      return result;

    } catch (err) {
      console.log("deleteThreadFromBoard err:", err);
      return null;
    }
  }

  this.reportThread = async(boardId, threadId) => {
    var result;
    try {
      var mb = await MessageBoard.findById(boardId).exec();
      if (!mb) {
        result = {notFound: 'Message Board not found!'};
      } else {
        var thread = mb.threads.find((thread) => {
          if (thread._id == threadId) {
            thread.reported = true;
          }
          return thread._id == threadId;
        });

        if (thread) {
          await mb.save();
          result = {thread: thread};
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
