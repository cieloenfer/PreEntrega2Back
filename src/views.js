const express = require('express');
const fs = require('fs/promises');

function viewsRouter(io) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    // Obtener productos y renderizar la vista home.handlebars
    try {
      const data = await fs.readFile('productos.json', 'utf-8');
      const products = JSON.parse(data);
      res.render('home', { products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  });

  router.get('/realtimeproducts', async (req, res) => {
    // Obtener productos y renderizar la vista realTimeProducts.handlebars
    try {
      const data = await fs.readFile('productos.json', 'utf-8');
      const products = JSON.parse(data);
      res.render('realTimeProducts', { products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  });

  io.on('connection', (socket) => {
    console.log('Usuario conectado');

    // Manejar eventos de socket aquí
    socket.on('addProduct', (data) => {
      // Agregar lógica para agregar un nuevo producto
      // y emitir el evento a todos los clientes
      // Ejemplo: io.emit('updateProducts', updatedProducts);
    });

    socket.on('disconnect', () => {
      console.log('Usuario desconectado');
    });
  });

  return router;
}

module.exports = viewsRouter;
