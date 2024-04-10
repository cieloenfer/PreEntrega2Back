// dao/messageDao.js

const Message = require('../models/messageModel');

class MessageDao {
  async sendMessage(messageData) {
    try {
      const newMessage = new Message(messageData);
      await newMessage.save();
      return newMessage;
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      throw error;
    }
  }

  async getMessages() {
    try {
      const messages = await Message.find();
      return messages;
    } catch (error) {
      console.error("Error al obtener los mensajes:", error);
      throw error;
    }
  }
}

module.exports = MessageDao;
