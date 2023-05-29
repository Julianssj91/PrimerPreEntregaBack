const fs = require('fs').promises;

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      const products = JSON.parse(data);
      return products.find((product) => product.id === id);
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  }
}

module.exports = ProductManager;
