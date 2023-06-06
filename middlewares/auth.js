const { getAllUsers } = require("../models/users");

// For signup
async function checkUsernameAvailabilitiy(req, res, next) {
    const { username } = req.body;
    const usersList = await getAllUsers();
    const usernameTaken = usersList.find((user) => user.username === username);

    if (username.length >= 3) {
        if (!usernameTaken) {
            next();
        } else {
            res.json({
                success: false,
                usernameTaken: true,
                message: "Username is already taken, try another username!",
            });
        }
    } else {
        res.json({
            success: false,
            message: "Username not long enough, minimum 3 characters required",
        });
    }
}

// For signup
async function checkPasswordSecurity(req, res, next) {
    const { password } = req.body;

    if (password.length >= 8) {
        next();
    } else {
        res.json({
            success: false,
            message: "Password not long enough, minimum 8 characters required",
        });
    }
}

// For Login
async function checkUsernameMatch(req, res, next) {
    const { username } = req.body;
    const usersList = await getAllUsers();
    const matchedUser = usersList.find((user) => user.username === username);
    if (matchedUser) {
        next();
    } else {
        res.json({
            success: false,
            message: "We have nobody with that username registered here.",
        });
    }
}

// For login
async function checkPasswordMatch(req, res, next) {
    const { username, password } = req.body;
    const usersList = await getAllUsers();
    const matchedUser = usersList.find((user) => user.username === username);
    if (matchedUser.password === password) {
        next();
    } else {
        res.json({
            success: false,
            correctPassword: false,
            message: "Incorrect password, try again!",
        });
    }
}

module.exports = {
    checkPasswordMatch,
    checkPasswordSecurity,
    checkUsernameAvailabilitiy,
    checkUsernameMatch,
};
