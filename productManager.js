const fs = require('fs');

class ProductManager {
  constructor() {
    this.products = [];
    this.lastId = 0;
  }

  getProducts() {
    return this.products;
  }

  addProduct(product) {
    if (this.isCodeRepeated(product.code)) {
      throw new Error('El código del producto está repetido.');
    }

    const newProduct = {
      ...product,
      id: this.generateId(),
    };

    this.products.push(newProduct);
    return newProduct.id;
  }

  getProductById(id) {
    const product = this.products.find((p) => p.id === id);

    if (!product) {
      throw new Error('No se encontró ningún producto con el ID proporcionado.');
    }

    return product;
  }

  isCodeRepeated(code) {
    return this.products.some((product) => product.code === code);
  }

  generateId() {
    this.lastId++;
    return this.lastId;
  }

  saveToFile(filename) {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(filename, data);
  }

  loadFromFile(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    this.products = JSON.parse(data);
    this.updateLastId();
  }

  updateLastId() {
    const lastProduct = this.products[this.products.length - 1];
    this.lastId = lastProduct ? lastProduct.id : 0;
  }
}

const productManager = new ProductManager();

productManager.loadFromFile('productos.json');

const product = {
  title: 'producto prueba',
  description: 'Este es un producto prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc123',
  stock: 25,
};

try {
  const productId = productManager.addProduct(product);
  console.log('Producto agregado con éxito. ID:', productId);
} catch (error) {
  console.error('Error al agregar el producto:', error.message);
}

productManager.saveToFile('productos.json');

console.log(productManager.getProducts());

const productId = productManager.getProducts()[0].id;

try {
  const foundProduct = productManager.getProductById(productId);
  console.log('Producto encontrado:', foundProduct);
} catch (error) {
  console.error('Error al obtener el producto por ID:', error.message);
}
