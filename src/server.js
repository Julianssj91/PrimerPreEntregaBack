const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = 8080;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

app.use(express.json());

const productsRouter = express.Router();

productsRouter.get('/', (req, res) => {
    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al leer los productos' });
        } else {
            const products = JSON.parse(data);
            res.json(products);
        }
    });
});

productsRouter.get('/:pid', (req, res) => {
    const { pid } = req.params;
    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al leer los productos' });
        } else {
            const products = JSON.parse(data);
            const product = products.find((p) => p.id === pid);
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        }
    });
});

productsRouter.post('/', (req, res) => {
    const product = req.body;
    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al leer los productos' });
        } else {
            const products = JSON.parse(data);
            product.id = generateProductId(products);
            products.push(product);
            fs.writeFile('productos.json', JSON.stringify(products, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Error al agregar el producto' });
                } else {
                    res.status(201).json(product);
                }
            });
        }
    });
});

productsRouter.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const updatedProduct = req.body;
    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al leer los productos' });
        } else {
            const products = JSON.parse(data);
            const index = products.findIndex((p) => p.id === pid);
            if (index !== -1) {
                updatedProduct.id = pid;
                products[index] = updatedProduct;
                fs.writeFile('productos.json', JSON.stringify(products, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({ error: 'Error al actualizar el producto' });
                    } else {
                        res.json(updatedProduct);
                    }
                });
            } else {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        }
    });
});

productsRouter.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    fs.readFile('productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al leer los productos' });
        } else {
            const products = JSON.parse(data);
            const index = products.findIndex((p) => p.id === pid);
            if (index !== -1) {
                const deletedProduct = products.splice(index, 1)[0];
                fs.writeFile('productos.json', JSON.stringify(products, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({ error: 'Error al eliminar el producto' });
                    } else {
                        res.json(deletedProduct);
                    }
                });
            } else {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        }
    });
});

const cartsRouter = express.Router();

cartsRouter.post('/', (req, res) => {
    const cart = {
        id: generateCartId(),
        products: []
    };
    fs.writeFile('carrito.json', JSON.stringify(cart, null, 2), (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al crear el carrito' });
        } else {
            res.status(201).json(cart);
        }
    });
});

cartsRouter.get('/:cid', (req, res) => {
    const { cid } = req.params;
    fs.readFile('carrito.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al leer el carrito' });
        } else {
            const cart = JSON.parse(data);
            if (cart.id === cid) {
                res.json(cart.products);
            } else {
                res.status(404).json({ error: 'Carrito no encontrado' });
            }
        }
    });
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    fs.readFile('carrito.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al leer el carrito' });
        } else {
            const cart = JSON.parse(data);
            if (cart.id === cid) {
                const product = { id: pid, quantity };
                cart.products.push(product);
                fs.writeFile('carrito.json', JSON.stringify(cart, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
                    } else {
                        res.json(cart.products);
                    }
                });
            } else {
                res.status(404).json({ error: 'Carrito no encontrado' });
            }
        }
    });
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.post('/api/upload', upload.single('image'), (req, res) => {
    if (req.file) {
        res.send('Archivo cargado correctamente');
    } else {
        res.status(400).json({ error: 'No se ha proporcionado un archivo' });
    }
});

function generateProductId(products) {
    let id = Math.floor(Math.random() * 1000);
    while (products.some((p) => p.id === id)) {
        id = Math.floor(Math.random() * 1000);
    }
    return id;
}

function generateCartId() {
    return Math.random().toString(36).substr(2, 9);
}

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
