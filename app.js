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
    return newProduct.id; // Retorna el id del producto agregado
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

    // Conservar el ID y actualizar los campos especificados
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

// Crear instancia de ProductManager
const productManager = new ProductManager();

// Obtener productos (debe devolver un arreglo vacío [])
console.log(productManager.getProducts());

// Agregar un producto
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

// Obtener productos nuevamente (debe aparecer el producto recién agregado)
console.log(productManager.getProducts());

// Obtener el producto por su ID y comprobar que coincide
try {
  const productId = productManager.getProducts()[0].id; // Suponemos que hay al menos un producto agregado
  const foundProduct = productManager.getProductById(productId);
  console.log('Producto encontrado:', foundProduct);
} catch (error) {
  console.error('Error al obtener el producto por ID:', error.message);
}

// Actualizar un campo del producto
try {
  const productId = productManager.getProducts()[0].id; // Suponemos que hay al menos un producto agregado
  const updatedProduct = productManager.updateProduct(productId, { price: 250 });
  console.log('Producto actualizado:', updatedProduct);
} catch (error) {
  console.error('Error al actualizar el producto:', error.message);
}

// Eliminar el producto
try {
  const productId = productManager.getProducts()[0].id; // Suponemos que hay al menos un producto agregado
  const deletedProduct = productManager.deleteProduct(productId);
  console.log('Producto eliminado:', deletedProduct);
} catch (error) {
  console.error('Error al eliminar el producto:', error.message);
}
