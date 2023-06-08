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

async function updateMenuItem(id, newValues, modifiedAt) {
    return await menuDb.update({ _id: id }, { $set: { title: newValues.title, desc: newValues.desc, price: newValues.price, modifiedAt: modifiedAt}});
}

async function deleteMenuItem(id) {
    return await menuDb.remove({ _id: id });
}

async function findItemId(id) {
    return await menuDb.findOne({ _id: id });
}

module.exports = { getAllMenuItems, findMenuItemById, addMenuItem, deleteMenuItem, findItemId, updateMenuItem }