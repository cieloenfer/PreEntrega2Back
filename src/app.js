const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const Product = require('./models/Product'); // Importa el modelo de Producto
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 8080;

// Configurar Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Configurar middleware para manejar archivos estáticos
app.use(express.static('public'));

// Configurar las rutas y los manejadores de Socket.io
const productsRouter = require('./product');
const cartRouter = require('./carrito');
const viewsRouter = require('./routes/views')(io);

app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);

// Manejador de conexión con Socket.io
io.on('connection', (socket) => {
  console.log('Usuario conectado');
  socket.on('addProduct', async (data) => {
    try {
      const newProduct = new Product({
        title: data.title,
        price: parseFloat(data.price),
        // Agregar otros campos según la estructura del modelo Product
      });

      await newProduct.save(); // Guarda el nuevo producto en la base de datos

      // Emitir el evento a todos los clientes para actualizar la lista en tiempo real
      const products = await Product.find(); // Obtén la lista actualizada de productos desde la base de datos
      io.emit('updateProducts', products);
    } catch (error) {
      console.error(error);
      // Manejar errores
    }
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Conexión a MongoDB utilizando Mongoose
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conexión a MongoDB establecida');
}).catch((error) => {
  console.error('Error al conectar a MongoDB:', error);
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
