const { findMenuItemById } = require("../models/menu");

async function calculateTotalPrice(req, res, next) {
    const products = req.body.products;
    let totalPrice = 0;

    for (let product of products) {
        const [targetCoffee] = await findMenuItemById(product._id);

        let quantitySum = product.quantity * targetCoffee.price;
        totalPrice += quantitySum;
    }
    res.locals.totalPrice = totalPrice;
    res.locals.products = products;
    next();
}

module.exports = { calculateTotalPrice };
