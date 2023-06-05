const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const cartFilePath = path.join(__dirname, '../data/carrito.json');

const createCart = () => {
    const cart = {
        id: uuidv4(),
        products: [],
    };
    return cart;
};

const getCartById = async (cartId) => {
    try {
        const data = await fs.readFile(cartFilePath, 'utf8');
        const carts = JSON.parse(data);
        const cart = carts.find((c) => c.id === cartId);
        return cart;
    } catch (error) {
        console.error('Error reading cart file:', error);
        return null;
    }
};

const saveCarts = async (carts) => {
    try {
        await fs.writeFile(cartFilePath, JSON.stringify(carts, null, 2));
    } catch (error) {
        console.error('Error writing cart file:', error);
    }
};

const addProductToCart = async (cartId, productId, quantity) => {
    try {
        const data = await fs.readFile(cartFilePath, 'utf8');
        const carts = JSON.parse(data);
        const cart = carts.find((c) => c.id === cartId);
        if (cart) {
            const existingProduct = cart.products.find((p) => p.product === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }
            await saveCarts(carts);
            return cart;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error reading cart file:', error);
        return null;
    }
};

module.exports = {
    createCart,
    getCartById,
    addProductToCart,
};
