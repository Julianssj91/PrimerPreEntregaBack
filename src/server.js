const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const exphbs = require('express-handlebars');
const http = require('http');
const io = require('socket.io')(http);

const app = express();
const PORT = 8080;

// Configuración de Multer para el manejo de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Middleware para procesar JSON en las solicitudes
app.use(express.json());

// Configurar el motor de plantillas Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Datos de ejemplo para productos y carritos
let products = [];

// Rutas para el manejo de productos
const productsRouter = express.Router();

productsRouter.get('/', (req, res) => {
  res.json(products);
});

productsRouter.get('/:pid', (req, res) => {
  const { pid } = req.params;
  const product = products.find((p) => p.id === pid);

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

  // Enviar la lista de productos actualizada a través de Socket.IO
  io.emit('productAdded', products);

  res.status(201).json(newProduct);
});

// ... Resto de rutas para actualización, eliminación, etc.

// Ruta para subir archivos
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No se ha seleccionado ningún archivo' });
    return;
  }

  const filePath = path.join(__dirname, 'uploads', req.file.filename);
  res.status(200).json({ message: 'Archivo subido correctamente', filePath });
});

// Ruta para la vista "home.handlebars"
app.get('/', (req, res) => {
  res.render('home', { products: products });
});

// Ruta para la vista "realTimeProducts.handlebars"
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products: products });
});

// Configurar Socket.IO
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Escuchar eventos desde el cliente
  socket.on('deleteProduct', (productId) => {
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex !== -1) {
      products.splice(productIndex, 1);

      // Enviar la lista de productos actualizada a través de Socket.IO
      io.emit('productDeleted', products);
    }
  });
});

// Iniciar el servidor
http.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
