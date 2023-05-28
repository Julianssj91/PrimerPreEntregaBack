const express = require('express');
const fs = require('fs');
const app = express();

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    getProducts() {
        return this.loadFromFile();
    }

    loadFromFile() {
        const data = fs.readFileSync(this.path, 'utf8');
        return JSON.parse(data);
    }
}

app.get('/products', (req, res) => {
    const productManager = new ProductManager('productos.json');
    const products = productManager.getProducts();
    res.json(products);
});

app.get('/products', (req, res) => {
    const limit = parseInt(req.query.limit) || 0;
    const productManager = new ProductManager('productos.json');
    const products = productManager.getProducts().slice(0, limit);
    res.json(products);
});

app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productManager = new ProductManager('productos.json');
    const products = productManager.getProducts();
    const product = products.find((p) => p.id === productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

app.use((req, res) => {
    res.status(404).json({ error: 'Página no encontrada' });
});

app.listen(8080, () => {
    console.log('Servidor iniciado en http://localhost:8080');
});
