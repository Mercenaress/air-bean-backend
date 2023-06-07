const { getAllMenuItems } = require("../models/menu");

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

module.exports = {
    checkProductnameAvailability
};