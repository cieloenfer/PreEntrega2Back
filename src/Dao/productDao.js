const { ObjectId } = require('mongodb');

class ProductDao {
  constructor(db) {
    this.db = db; // Aquí pasas una instancia de la base de datos MongoDB
  }

  async addProduct(productData) {
    try {
      const result = await this.db.collection('products').insertOne(productData);
      return result.insertedId; // Devuelve el ID del producto insertado
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      throw error; // Lanza el error para que sea manejado por el código que llama a este método
    }
  }

  async getProduct(productId) {
    try {
      const product = await this.db.collection('products').findOne({ _id: ObjectId(productId) });
      return product;
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      throw error; // Lanza el error para que sea manejado por el código que llama a este método
    }
  }

  async updateProduct(productId, newData) {
    try {
      const result = await this.db.collection('products').updateOne(
        { _id: ObjectId(productId) },
        { $set: newData }
      );
      return result.modifiedCount > 0; // Devuelve true si se actualizó al menos un documento
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      throw error; // Lanza el error para que sea manejado por el código que llama a este método
    }
  }

  async deleteProduct(productId) {
    try {
      const result = await this.db.collection('products').deleteOne({ _id: ObjectId(productId) });
      return result.deletedCount > 0; // Devuelve true si se eliminó al menos un documento
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      throw error; // Lanza el error para que sea manejado por el código que llama a este método
    }
  }

  async getAllProducts() {
    try {
      const products = await this.db.collection('products').find({}).toArray();
      return products;
    } catch (error) {
      console.error("Error al obtener todos los productos:", error);
      throw error; // Lanza el error para que sea manejado por el código que llama a este método
    }
  }
}

module.exports = ProductDao;
