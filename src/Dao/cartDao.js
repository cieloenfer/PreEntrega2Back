const { ObjectId } = require('mongodb');

class CartDao {
  constructor(db) {
    this.db = db; // Aquí pasas una instancia de la base de datos MongoDB
  }

  async addToCart(cartData) {
    try {
      const result = await this.db.collection('carts').insertOne(cartData);
      return result.insertedId; // Devuelve el ID del carrito insertado
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      throw error; // Lanza el error para que sea manejado por el código que llama a este método
    }
  }

  async getCart(cartId) {
    try {
      const cart = await this.db.collection('carts').findOne({ _id: ObjectId(cartId) });
      return cart;
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      throw error; // Lanza el error para que sea manejado por el código que llama a este método
    }
  }

  async updateCart(cartId, newData) {
    try {
      const result = await this.db.collection('carts').updateOne(
        { _id: ObjectId(cartId) },
        { $set: newData }
      );
      return result.modifiedCount > 0; // Devuelve true si se actualizó al menos un documento
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      throw error; // Lanza el error para que sea manejado por el código que llama a este método
    }
  }

  async deleteCart(cartId) {
    try {
      const result = await this.db.collection('carts').deleteOne({ _id: ObjectId(cartId) });
      return result.deletedCount > 0; // Devuelve true si se eliminó al menos un documento
    } catch (error) {
      console.error("Error al eliminar el carrito:", error);
      throw error; // Lanza el error para que sea manejado por el código que llama a este método
    }
  }
}

module.exports = CartDao;
