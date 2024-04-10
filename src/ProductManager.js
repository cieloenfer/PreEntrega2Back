const fs = require('fs/promises');

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async getAllProducts() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error('Error reading products file');
    }
  }

  async getProductById(productId) {
    const products = await this.getAllProducts();
    return products.find(product => product.id === productId);
  }
}

module.exports = ProductManager;