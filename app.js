class ProductManager {
  constructor() {
    this.products = [];
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
    const ids = this.products.map((product) => product.id);
    let newId;

    do {
      newId = Math.floor(Math.random() * 1000) + 1;
    } while (ids.includes(newId));

    return newId;
  }
}


const productManager = new ProductManager();

// Obtener productos (debe devolver un arreglo vacío [])
console.log(productManager.getProducts());

// Agregar producto
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
  console.log('Producto agregado con éxito.');
} catch (error) {
  console.error('Error al agregar el producto:', error.message);
}

// Obtener productos nuevamente 
console.log(productManager.getProducts());

// Agregar un producto con el mismo código (debe arrojar un error)
try {
  productManager.addProduct(product);
  console.log('Producto agregado con éxito.');
} catch (error) {
  console.error('Error al agregar el producto:', error.message);
}

// Obtener un producto por su ID (debe devolver el producto si se encuentra o arrojar un error si no se encuentra)
const productId = productManager.getProducts()[0].id; 

try {
  const foundProduct = productManager.getProductById(productId);
  console.log('Producto encontrado:', foundProduct);
} catch (error) {
  console.error('Error al obtener el producto por ID:', error.message);
}
