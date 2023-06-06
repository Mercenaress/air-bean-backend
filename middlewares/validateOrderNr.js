const { findOrderByOrderNr } = require("../models/orders");

async function validateOrderNr(req, res, next) {
    const orderNr = req.params.ordernr;
    const order = await findOrderByOrderNr(orderNr);

    if (order) {
        next();
    } else {
        res.status(404).json({
            success: false,
            message: "Order not found",
        });
    }
}

module.exports = { validateOrderNr };
