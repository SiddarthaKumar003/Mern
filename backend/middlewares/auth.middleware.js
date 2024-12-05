import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authenticateToken = async (req, res, next) => {
    let token;
    // Check if token is in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    // Otherwise, check if it's in the cookies (assuming it's a refresh token or otherwise)
    else if (req.cookies?.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    console.log("Request coming inside the authenticate token");
    try {
        console.log("Verifying token...",token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded information:", decoded);

        // Find the user by ID and attach it to the request
        req.user = await User.findById(decoded.userId).select('-password');
        // console.log("User details in middleware:", req.user);

        next(); // Pass control to the next middleware function

    } catch (err) {
        console.error("Token verification failed:", err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
