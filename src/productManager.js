const express = require('express');
const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
  }

  getProducts() {
    return this.loadFromFile();
  }

  addProduct(product) {
    if (this.isCodeRepeated(product.code)) {
      throw new Error('El código del producto está repetido.');
    }

    const newProduct = {
      ...product,
      id: this.generateId(),
    };

    const products = this.loadFromFile();
    products.push(newProduct);
    this.saveToFile(products);
    console.log('Producto agregado con éxito. ID:', newProduct.id);
  }

  getProductById(id) {
    const product = this.loadFromFile().find((p) => p.id === id);

    if (!product) {
      throw new Error('No se encontró ningún producto con el ID proporcionado.');
    }

    return product;
  }

  isCodeRepeated(code) {
    return this.loadFromFile().some((product) => product.code === code);
  }

  generateId() {
    const ids = this.loadFromFile().map((product) => product.id);
    let newId;

    do {
      newId = Math.floor(Math.random() * 1000) + 1;
    } while (ids.includes(newId));

    return newId;
  }

  loadFromFile() {
    const data = fs.readFileSync(this.path, 'utf8');
    return JSON.parse(data);
  }

  saveToFile(data) {
    fs.writeFileSync(this.path, JSON.stringify(data, null, 2));
  }
}

const productManager = new ProductManager('productos.json');

console.log(productManager.getProducts());

const product = {
  title: 'producto prueba',
  description: 'Este es un producto prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc123',
  stock: 25,
};

try {
  productManager.addProduct(product);
} catch (error) {
  console.error('Error al agregar el producto:', error.message);
}

console.log(productManager.getProducts());

try {
  productManager.addProduct(product);
} catch (error) {
  console.error('Error al agregar el producto:', error.message);
}

const productId = productManager.getProducts()[0].id; 

try {
  const foundProduct = productManager.getProductById(productId);
  console.log('Producto encontrado:', foundProduct);
} catch (error) {
  console.error('Error al obtener el producto por ID:', error.message);
}
