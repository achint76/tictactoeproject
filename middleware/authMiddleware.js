// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     console.log(token, "TOKEN");
//     if (!token) {
//         return res.status(401).json({ message: 'Access denied, no token provided' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(400).json({ message: 'Invalid token' });
//     }
// };

// module.exports = authMiddleware;



const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    let token = authHeader.replace('Bearer ', '');

    // Remove surrounding quotes if present
    // if (token.startsWith('"') && token.endsWith('"')) {
    //     token = token.slice(1, -1);
    // }

    console.log('Extracted Token:', token);

    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.log('JWT Error:', error);
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
