const express = require('express');
const router = express.Router();
const MessageDao = require('./Dao/messageDao');

router.get('/chat', async (req, res) => {
  try {
    const messageDao = new MessageDao();
    const messages = await messageDao.getMessages();
    res.render('chat', { messages });
  } catch (error) {
    console.error("Error al obtener los mensajes:", error);
    res.status(500).send("Error al obtener los mensajes.");
  }
});

router.post('/sendMessage', async (req, res) => {
  try {
    const { user, message } = req.body;
    const messageDao = new MessageDao();
    await messageDao.sendMessage({ user, message });
    res.redirect('/chat');
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    res.status(500).send("Error al enviar el mensaje.");
  }
});

module.exports = router;


