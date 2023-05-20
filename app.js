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

  updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new Error('No se encontró ningún producto con el ID proporcionado.');
    }

    
    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updatedFields,
      id: id,
    };

    return this.products[productIndex];
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new Error('No se encontró ningún producto con el ID proporcionado.');
    }

    const deletedProduct = this.products.splice(productIndex, 1)[0];
    return deletedProduct;
  }

  isCodeRepeated(code) {
    return this.products.some((product) => product.code === code);
  }

  generateId() {
    this.lastId++;
    return this.lastId;
  }
}


const productManager = new ProductManager();

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
  const productId = productManager.addProduct(product);
  console.log('Producto agregado con éxito. ID:', productId);
} catch (error) {
  console.error('Error al agregar el producto:', error.message);
}

console.log(productManager.getProducts());

try {
  const productId = productManager.getProducts()[0].id; 
  const foundProduct = productManager.getProductById(productId);
  console.log('Producto encontrado:', foundProduct);
} catch (error) {
  console.error('Error al obtener el producto por ID:', error.message);
}

try {
  const productId = productManager.getProducts()[0].id; 
  const updatedProduct = productManager.updateProduct(productId, { price: 250 });
  console.log('Producto actualizado:', updatedProduct);
} catch (error) {
  console.error('Error al actualizar el producto:', error.message);
}

try {
  const productId = productManager.getProducts()[0].id; 
  const deletedProduct = productManager.deleteProduct(productId);
  console.log('Producto eliminado:', deletedProduct);
} catch (error) {
  console.error('Error al eliminar el producto:', error.message);
}
