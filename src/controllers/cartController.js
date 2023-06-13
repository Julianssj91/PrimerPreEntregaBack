

const cartController = {
    createCart: (req, res) => {
      res.send('Nuevo carrito creado');
    },
  
    getCartById: (req, res) => {
      const { cid } = req.params;
      res.send(`Productos del carrito con ID ${cid}`);
    },
  
    addProductToCart: (req, res) => {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      res.send(`Producto ${pid} agregado al carrito ${cid}`);
    }
  };
  
  module.exports = cartController;
  