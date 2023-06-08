const { getAllMenuItems, findItemId } = require("../models/menu");

async function checkProductnameAvailability(req, res, next) {
    const { title } = req.body;
    const menu = await getAllMenuItems();
    const itemNameTaken = menu.find((menuItem) => menuItem.title === title);

    if (!itemNameTaken) {
        next();
    } else {
        res.json({
            success: false,
            itemNameTaken: true,
            message: "Produt name already exists, please try another or edit the existing item."
        })
    }
}

async function validateProductData(req, res, next) {
    const body = req.body;

    if (body.hasOwnProperty('title') && body.hasOwnProperty('desc') && body.hasOwnProperty('price')) {
        next();
    } else {
        res.json({
            success: false,
            missingData: true,
            message: "Product must include title, desc and price. Please double check your input."
        })
    }
}

async function checkIfProductExist(req, res, next) {
    const id = req.body.id;
    const findId = await findItemId(id);

    if (findId) {
        next();
    } else {
        res.json({
            success: false,
            findId: false,
            message: "Failed to find ID."
        })
    }
}

module.exports = {
    checkProductnameAvailability,
    validateProductData,
    checkIfProductExist
};