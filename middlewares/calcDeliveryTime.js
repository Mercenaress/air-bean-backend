const { findOrderByOrderNr } = require("../models/orders");

async function calcDeliveryTime(req, res, next) {
    const validatedOrderNr = req.params.ordernr;
    const order = await findOrderByOrderNr(validatedOrderNr);

    const currentTime = new Date();
    const timeLeftInMilliseconds = order.deliveryTime - currentTime;
    const timeLeftInMinutes = Math.max(
        Math.round(timeLeftInMilliseconds / 60000),
        0
    ); // 60000 milliseconds in a minute

    res.locals.timeLeft = timeLeftInMinutes;
    next();
}

module.exports = { calcDeliveryTime };
