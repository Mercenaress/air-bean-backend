const jwt = require('jsonwebtoken');
const secretKey = "heh";

function generateToken(payload) {
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    return token;
}

function verifyToken(allowedRoles) {
    return (req, res, next) => {
        console.log(allowedRoles);
        const token = req.headers.authorization.replace('Bearer ', '');
        const validToken = jwt.verify(token, secretKey);
        if (validToken) {
            if (allowedRoles.includes(validToken.role)) {
                next();
            } else {
                res.status(403).json({
                    success: false,
                    message: "Missing permission for access."
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid token.",
            });
        }
    }
}

module.exports = {
    generateToken,
    verifyToken,
}