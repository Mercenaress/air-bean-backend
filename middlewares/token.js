const jwt = require('jsonwebtoken');

const secretKey = "heh";

function generateToken(payload) {
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    return token;
}

function verifyToken(req, res, next) {
    try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const validToken = jwt.verify(token, secretKey);
        if (validToken) {
            next();
        } else {
            res.json({
                success: false,
                message: "Invalid token.",
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Invalid token",
            error: err.code,
        });
    }
}

module.exports = {
    generateToken,
    verifyToken,
}