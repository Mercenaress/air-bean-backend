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
const { checkProductnameAvailability, validateProductData, checkIfProductExist } = require("./middlewares/validateItem");
const { checkProducts } = require("./middlewares/checkProducts");
const { validateOrderNr } = require("./middlewares/validateOrderNr");
const { calcDeliveryTime } = require("./middlewares/calcDeliveryTime");
const { calculateTotalPrice } = require("./middlewares/calculateTotalPrice");
const { createUser, findUserByUsername } = require("./models/users");
const { getAllMenuItems, addMenuItem, deleteMenuItem, updateMenuItem, findItemId } = require("./models/menu");
const { saveToOrders, findOrdersByUserId } = require("./models/orders");
const { uuid } = require("uuidv4");
const express = require("express");
const { generateToken, verifyToken } = require("./middlewares/token");
const { addCampaign } = require("./models/campaign");
const { hashPassword } = require("./middlewares/bcrypt");
const app = express();
const allowedRoles = ["admin"];

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
    "/api/menu/addProduct",
    verifyToken(allowedRoles),
    validateProductData,
    checkProductnameAvailability,
    async (req, res) => {
        try {
            const menuItem = {
                title: req.body.title,
                desc: req.body.desc,
                price: req.body.price,
                createdAt: new Date(),
            };
            await addMenuItem(menuItem);
            res.status(201).json({ success: true });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Error occurred while adding item",
                error: err.code,
            });
        }
    }
);

app.put(
    "/api/menu/editProduct",
    verifyToken(allowedRoles),
    validateProductData,
    async (req, res) => {
        try {
            const id = req.body.id;
            const existingId = await findItemId(id);
            if (existingId) {
                const modifiedAt = new Date();
                const newValues = {
                    title: req.body.title,
                    desc: req.body.desc,
                    price: req.body.price,
                }
                await updateMenuItem(id, newValues, modifiedAt);
                res.status(200).json({ success:true });
            } else {
                res.status(404).json({
                    success: false,
                    message: "The product you tried to edit does not exist"
                });
            }
        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Error occured while editing item",
                error: err.code,
            });
        }
    }
);

app.delete(
    "/api/menu/removeProduct",
    verifyToken(allowedRoles),
    checkIfProductExist,
    async (req, res) => {
        try {
            const id = req.body.id;
            await deleteMenuItem(id);
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Error occured while deleting item",
                error: err.code,
            });
        }
    }
);

app.post(
    "/api/campaigns/addCampaign",
    verifyToken(allowedRoles),
    checkProducts,
    async (req, res) => {
        const campaignProducts = req.body.products;
        const campaignPrice = req.body.price;

        const newCampaign = {
            products: campaignProducts,
            price: campaignPrice
        }

        await addCampaign(newCampaign);
        res.json({ success: true });
    }
);

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
            const password = req.body.password;
            const hashedPass = await hashPassword(password);
            const user = {
                username: req.body.username,
                password: hashedPass,
                role: req.body.role,
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
            const user = await findUserByUsername(req.body.username);
            const payload = {
                username: user.username,
                role: user.role,
                id: user._id,
            }
            const token = generateToken(payload);
            res.json({ success: true, isLoggedIn: true, token: token });
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
