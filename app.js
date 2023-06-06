const {
    checkUsernameMatch,
    checkPasswordMatch,
    checkUsernameAvailabilitiy,
    checkPasswordSecurity,
} = require("./middlewares/auth");
const {
    validateUserId,
    validateUserIdOrGuest,
} = require("./middlewares/validateUser");
const { checkProducts } = require("./middlewares/checkProducts");
const { validateOrderNr } = require("./middlewares/validateOrderNr");
const { calcDeliveryTime } = require("./middlewares/calcDeliveryTime");
const { calculateTotalPrice } = require("./middlewares/calculateTotalPrice");
const { createUser } = require("./models/users");
const { getAllMenuItems } = require("./models/menu");
const { saveToOrders, findOrdersByUserId } = require("./models/orders");
const { uuid } = require("uuidv4");
const express = require("express");
const app = express();

const port = 5000;

app.use(express.json());

app.get("/api/menu", async (req, res) => {
    try {
        res.status(200).json({ success: true, data: await getAllMenuItems() });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Could not fetch from database",
            error: err.code,
        });
    }
});

app.post(
    "/api/order/:userId",
    validateUserIdOrGuest,
    checkProducts,
    calculateTotalPrice,
    async (req, res) => {
        const order = {
            userId: req.params.userId,
            orderNr: uuid(),
            orderTime: new Date(),
            deliveryTime: new Date(new Date().getTime() + 20 * 60000), // 20 minutes
            totalPrice: res.locals.totalPrice,
            products: res.locals.products,
        };

        try {
            await saveToOrders(order); // Adds order to database
            res.json({
                success: true,
                message: "Order placed successfully",
                eta: 20,
                orderNr: order.orderNr,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Could not fetch from database",
                error: err.code,
            });
        }
    }
);

app.post(
    "/api/user/signup",
    checkUsernameAvailabilitiy,
    checkPasswordSecurity,
    async (req, res) => {
        try {
            const user = {
                username: req.body.username,
                password: req.body.password,
                userId: uuid(),
            };
            await createUser(user); // Adds user to database
            res.status(201).json({ success: true });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Error occurred while creating user",
                error: err.code,
            });
        }
    }
);

app.post(
    "/api/user/login",
    checkUsernameMatch,
    checkPasswordMatch,
    async (req, res) => {
        try {
            res.json({ success: true, isLoggedIn: true });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Error occurred while logging in user",
                error: err.code,
            });
        }
    }
);

app.get("/api/user/:userId/history", validateUserId, async (req, res) => {
    const userId = req.params.userId;

    try {
        const orderHistory = await findOrdersByUserId(userId);
        res.json({ success: true, orderHistory });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error occurred while getting orderHistory",
            error: err.code,
        });
    }
});

app.get(
    "/api/order/status/:ordernr",
    validateOrderNr,
    calcDeliveryTime,
    async (req, res) => {
        try {
            res.json({
                success: true,
                timeLeft: res.locals.timeLeft,
                isDelivered: res.locals.timeLeft <= 0 ? true : false,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Error occurred while getting status of order",
                code: err.code,
            });
        }
    }
);

app.listen(port, () => {
    console.log("Server listening on " + port);
});
