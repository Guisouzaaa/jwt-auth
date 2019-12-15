require('dotenv').config();
const jwt = require('jsonwebtoken');

async function verifyToken(req, res, next) {
    const header = req.headers['authorization'];

    if (!header) return res.status(400).json({error: 'No token found'});

    const bearer = header.split(' ')[0];
    if (bearer !== 'bearer') return res.status(401).json({error: 'Invalid token format'})

    const token = header.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({error: err.message})
        req.token = decoded;
        next();
    });
}

module.exports = verifyToken;