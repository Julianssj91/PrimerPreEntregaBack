const express = require('express');
const ProductManager = require('./productManager');



const app = express();
const port = 8080;

const productManager = new ProductManager('DATA/productos.json');


app.get('/products', async (req, res) => {
    try {
        const products = await productManager.getProducts();

        if (req.query.limit) {
            const limit = parseInt(req.query.limit);
            return res.status(200).json(products.slice(0, limit));
        } else {
            return res.status(200).json(products);
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = await productManager.getProductById(id);

        if (product) {
            return res.status(200).json(product);
        } else {
            return res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
