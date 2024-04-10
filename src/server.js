const express = require('express');
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8080;

app.use(express.json());

// Productos
const productosFilePath = './productos.json';

app.get('/api/products', async (req, res) => {
  try {
    const productos = await fs.readFile(productosFilePath, 'utf-8');
    res.json(JSON.parse(productos));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.get('/api/products/:pid', async (req, res) => {
  try {
    const productos = await fs.readFile(productosFilePath, 'utf-8');
    const productosArray = JSON.parse(productos);
    const producto = productosArray.find((p) => p.id === req.params.pid);
    if (producto) {
      res.json(producto);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const productos = await fs.readFile(productosFilePath, 'utf-8');
    const productosArray = JSON.parse(productos);
    
    const newProduct = {
      id: uuidv4(),
      title: req.body.title,
      description: req.body.description,
      code: req.body.code,
      price: req.body.price,
      status: req.body.status !== undefined ? req.body.status : true,
      stock: req.body.stock,
      category: req.body.category,
      thumbnails: req.body.thumbnails || [],
    };

    productosArray.push(newProduct);

    await fs.writeFile(productosFilePath, JSON.stringify(productosArray, null, 2));

    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto' });
  }
});

app.put('/api/products/:pid', async (req, res) => {
  try {
    const productos = await fs.readFile(productosFilePath, 'utf-8');
    let productosArray = JSON.parse(productos);

    const index = productosArray.findIndex((p) => p.id === req.params.pid);

    if (index !== -1) {
      productosArray[index] = {
        ...productosArray[index],
        ...req.body,
        id: req.params.pid, // Ensure the id remains the same
      };

      await fs.writeFile(productosFilePath, JSON.stringify(productosArray, null, 2));

      res.json(productosArray[index]);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

app.delete('/api/products/:pid', async (req, res) => {
  try {
    const productos = await fs.readFile(productosFilePath, 'utf-8');
    let productosArray = JSON.parse(productos);

    const filteredProductos = productosArray.filter((p) => p.id !== req.params.pid);

    if (filteredProductos.length < productosArray.length) {
      await fs.writeFile(productosFilePath, JSON.stringify(filteredProductos, null, 2));
      res.json({ message: 'Producto eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// Carritos
const carritosFilePath = './carritos.json';

app.post('/api/carts', async (req, res) => {
  try {
    const carritos = await fs.readFile(carritosFilePath, 'utf-8');
    const carritosArray = JSON.parse(carritos);

    const newCart = {
      id: uuidv4(),
      products: [],
    };

    carritosArray.push(newCart);

    await fs.writeFile(carritosFilePath, JSON.stringify(carritosArray, null, 2));

    res.json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear carrito' });
  }
});

app.get('/api/carts/:cid', async (req, res) => {
  try {
    const carritos = await fs.readFile(carritosFilePath, 'utf-8');
    const carritosArray = JSON.parse(carritos);

    const cart = carritosArray.find((c) => c.id === req.params.cid);

    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
  try {
    const carritos = await fs.readFile(carritosFilePath, 'utf-8');
    let carritosArray = JSON.parse(carritos);

    const cartIndex = carritosArray.findIndex((c) => c.id === req.params.cid);

    if (cartIndex !== -1) {
      const productIndex = carritosArray[cartIndex].products.findIndex(
        (p) => p.product === req.params.pid
      );

      if (productIndex !== -1) {
        // Product already exists in the cart, increment quantity
        carritosArray[cartIndex].products[productIndex].quantity += 1;
      } else {
        // Product doesn't exist in the cart, add it
        carritosArray[cartIndex].products.push({
          product: req.params.pid,
          quantity: 1,
        });
      }

      await fs.writeFile(carritosFilePath, JSON.stringify(carritosArray, null, 2));

      res.json(carritosArray[cartIndex].products);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
