const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'No token provided or token format is incorrect' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (decode.userId) {
            req.userId = decode.userId;
            next();
        } else {
            return res.status(403).json({ message: 'Invalid token' });
        }
    } catch (e) {
        return res.status(403).json({ message: 'Token verification failed' });
    }
};

module.exports = {
    authMiddleware
};