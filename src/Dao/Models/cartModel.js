const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al usuario que posee el carrito
  products: [{ 
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // Referencia al producto
    quantity: { type: Number, default: 1 }, // Cantidad del producto en el carrito (por defecto 1)
    price: { type: Number, required: true } // Precio del producto en el momento de agregarlo al carrito
  }],
  total: { type: Number, default: 0 }, // Total del carrito
  createdAt: { type: Date, default: Date.now }, // Fecha de creación del carrito
  updatedAt: { type: Date, default: Date.now } // Fecha de última actualización del carrito
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
