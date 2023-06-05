const fs = require('fs');

const productController = {
    getAllProducts: (req, res) => {
        try {
            const productsData = fs.readFileSync('productos.json', 'utf-8');
            const products = JSON.parse(productsData);
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getProductById: (req, res) => {
        try {
            const { pid } = req.params;
            const productsData = fs.readFileSync('productos.json', 'utf-8');
            const products = JSON.parse(productsData);
            const product = products.find((product) => product.id === pid);
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ error: 'Product not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    createProduct: (req, res) => {
        try {

            const newProduct = req.body;
            const productsData = fs.readFileSync('productos.json', 'utf-8');
            const products = JSON.parse(productsData);

            products.push(newProduct);
            fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateProduct: (req, res) => {
        try {
            const { pid } = req.params;
            const updatedProductData = req.body;
            const productsData = fs.readFileSync('productos.json', 'utf-8');
            const products = JSON.parse(productsData);
            const updatedProducts = products.map((product) => {
                if (product.id === pid) {

                    return updatedProductData;
                }
                return product;
            });
            fs.writeFileSync('productos.json', JSON.stringify(updatedProducts, null, 2));
            res.json(updatedProductData);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteProduct: (req, res) => {
        try {
            const { pid } = req.params;
            const productsData = fs.readFileSync('productos.json', 'utf-8');
            const products = JSON.parse(productsData);
            const updatedProducts = products.filter((product) => product.id !== pid);
            fs.writeFileSync('productos.json', JSON.stringify(updatedProducts, null, 2));
            res.json({ message: 'Product deleted' });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

module.exports = productController;
