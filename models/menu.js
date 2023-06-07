const nedb = require("nedb-promise");
menuDb = new nedb({ filename: "./databases/menu.db", autoload: true });

async function getAllMenuItems() {
    return await menuDb.find({});
}

async function findMenuItemById(id) {
    return await menuDb.find({ _id: id });
}

async function addMenuItem(menuItem) {
    return await menuDb.insert(menuItem);

}

module.exports = { getAllMenuItems, findMenuItemById, addMenuItem }