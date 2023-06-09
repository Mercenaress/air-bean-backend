const bcrypt = require('bcrypt');

async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

async function comparePassword(password, hashedPassword) {
    const validPassword = await bcrypt.compare(password, hashedPassword);
    return validPassword;
}

module.exports = {
    hashPassword,
    comparePassword
}