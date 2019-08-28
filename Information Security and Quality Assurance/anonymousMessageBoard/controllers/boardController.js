const MessageBoard = require('../models/messageBoard');

module.exports = function() {

  this.getAllMessageBoards = async() => {
    var result;
    try {
      var mbs = await MessageBoard.find({}).exec();
      if (!mbs) {
        result = {notFound: 'Message Boards not found!'};
      } else {
        result = {'boards': mbs};
      }
      return result;
    } catch(err) {
      console.log("getAllMessageBoards err:", err);
      return null;
    }
  }

  this.getMessageBoard = async(id) => {
    var result;
    try {
      var mb = await MessageBoard.findById(id).exec();
      if (!mb) {
        result = {notFound: 'Message Board not found!'};
      } else {
        result = {'board': mb};
      }
      return result;
    } catch(err) {
      console.log("getMessageBoard err:", err);
      return null;
    }
  }

  this.addNewMessageBoard = async(title, delete_password) => {
    var result;
    try {
      const newBoard = new MessageBoard({
        title,
        delete_password
      });

      await newBoard.save();
      return {'board': newBoard};
    } catch(err) {
      console.log("addNewMessageBoard err:", err);
      return null;
    }
  }

  this.deleteMessageBoard = async(_id, delete_password) => {
    var result;
    try {
      var mb = await MessageBoard.findById(_id).exec();
      if (!mb) {
        result = {notFound: 'Message Board not found!'};
      } else {
      if (mb.delete_password === delete_password) {
          await MessageBoard.findByIdAndDelete(_id).exec();
          result = {success: 'Successfully Deleted'};
        } else {
          result = {incorrectPassword: 'Password Incorrect'}
        }
      }

      return result;
    } catch(err) {
      console.log("deleteMessageBoard err:", err);
      return null;
    }
  }
}
