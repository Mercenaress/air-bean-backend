const nedb = require("nedb-promise");
ordersDb = new nedb({ filename: "./databases/orders.db", autoload: true });

async function saveToOrders(order) {
    return await ordersDb.insert(order);
}

async function findOrdersByUserId(userId) {
    return await ordersDb.find({ userId: userId });
}

async function findOrderByOrderNr(orderNr) {
    return await ordersDb.findOne({ orderNr: orderNr });
}

module.exports = { saveToOrders, findOrdersByUserId, findOrderByOrderNr };
