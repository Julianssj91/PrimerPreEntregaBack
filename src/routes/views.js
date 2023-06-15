const express = require('express');
const path = require('path');

const viewsRouter = express.Router();

// Ruta para la vista home
viewsRouter.get('/', (req, res) => {
  res.render('home');
});

// Ruta para la vista de productos en tiempo real
viewsRouter.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

module.exports = viewsRouter;
