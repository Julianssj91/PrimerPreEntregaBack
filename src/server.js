const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const productosData = fs.readFileSync('src/data/productos.json', 'utf-8');
const productos = JSON.parse(productosData);

const app = express();
const PORT = 8080;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());

let products = productos;
let carts = [];

const productsRouter = express.Router();

productsRouter.get('/', (req, res) => {
    res.json(products);
});

productsRouter.get('/:pid', (req, res) => {
    const { pid } = req.params;
    const product = products.find((p) => p.id === parseInt(pid));

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

productsRouter.post('/', (req, res) => {
    const { name, price, code } = req.body;

    if (!name || !price || !code) {
        res.status(400).json({ error: 'Faltan campos obligatorios' });
        return;
    }

    const newProduct = {
        id: uuidv4(),
        name,
        price,
        code,
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

productsRouter.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const { name, price, code } = req.body;

    const product = products.find((p) => p.id === parseInt(pid));

    if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.code = code || product.code;

        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

productsRouter.delete('/:pid', (req, res) => {
    const { pid } = req.params;

    const productIndex = products.findIndex((p) => p.id === parseInt(pid));

    if (productIndex !== -1) {
        products.splice(productIndex, 1);
        res.sendStatus(204);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

const cartsRouter = express.Router();

cartsRouter.get('/', (req, res) => {
    res.json(carts);
});

cartsRouter.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const cart = carts.find((c) => c.id === cid);

    if (cart) {
        res.json(cart);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

cartsRouter.post('/', (req, res) => {
    const newCart = {
        id: uuidv4(),
        products: [],
    };

    carts.push(newCart);
    res.status(201).json(newCart);
});

cartsRouter.post('/:cid/products/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const cart = carts.find((c) => c.id === cid);
    const product = products.find((p) => p.id === parseInt(pid));

    if (!cart) {
        res.status(404).json({ error: 'Carrito no encontrado' });
        return;
    }

    if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
    }

    const existingProduct = cart.products.find((p) => p.product === pid);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.products.push({ product: pid, quantity: 1 });
    }

    res.json(cart.products);
});

app.use('/products', productsRouter);
app.use('/carts', cartsRouter);

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: 'No se ha seleccionado ningún archivo' });
        return;
    }

    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    res.status(200).json({ message: 'Archivo subido correctamente', filePath });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
