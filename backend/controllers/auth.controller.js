import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

// Generate access token
const generateAccessToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '30m' }
    );
};

// Generate refresh token
const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
};

// Register a new user
export const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;
    const profileImage = req.file ? req.file.path : '';
    console.log("Requested is coming inside the register user");

    try {
        console.log("It is coming inside the try of register block");

        // if (!req.file) {
        //     return res.status(400).json({ message: 'Image upload failed', error: true });
        // }
        // console.log("Image url:-", profileImage);
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        console.log("User full name user and passwrod",fullName,email,password);
        user = new User({ fullName, email, password, profileImage });
        console.log("User has been created");
        await user.save();

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
        res.status(201).json({
            accessToken,
            success: true,
            message: "User created successfully"
        }
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: true });
    }
}
export const getUserDetails = async (req, res) => {
    try {
        console.log("User Id", req.user);
        res.status(200).json({
            success: true,
            message: 'Response fetched successfully',
            data: req.user
        }
        );
    } catch (error) {
        console.log("Error while fetching user details:", error);
        res.status(500).json({ message: 'Server error' });
    }
}
// to get all user details
export const getAllUsersDetails = async (req, res) => {
    try {
        console.log("User Id", req.user);
        const allUsers = await User.find();
        res.status(200).json({
            success: true,
            message: 'Response fetched successfully',
            data: allUsers
        }
        );
    } catch (error) {
        console.log("Error while fetching user details:", error);
        res.status(500).json({ message: 'Server error' });
    }
}
// update user details
export const updateUser = async (req, res) => {
    try {
        console.log("This is coming inside the updated user");
        const { userId } = req.params; // Assuming user ID is passed as a parameter
        console.log("Requested body:", req.body);
        const updatedData = {
            fullName: req.body.fullName,
            email: req.body.email,
            addresses: req.body.addresses,
            // handle file if necessary
            profileImage: req.body.profileImage,
        };
        console.log("Updated data in request", updatedData);
        console.log("Request has arrived inside update use details controller");
        // Find the user by ID and update their details
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
        console.log("Updated user details:", updatedUser);
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: updatedUser, message: 'User details updated successfully' });
    } catch (error) {
        console.log("Error to update the user", error);
        res.status(500).json({ success: false, message: 'Error updating user details', error });
    }
};

// Login user
export const loginUser = async (req, res) => {
    console.log("Information has come to the login");
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        console.log("User details",user);
        if (!user || !(await user.comparePassword(password))) {
            console.log("Invalid Information");
            return res.status(401).json({
                message: 'Invalid credentials',
                error: true
            }
            );
        }
        console.log("User has found");
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        user.refreshToken = refreshToken;
        await user.save();
        console.log("User has logged in:", user);
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
        res.status(200).json({
            data: user,
            accessToken,
            message: 'Successfully Login',
            success: true
        }
        );
    } catch (err) {
        console.log("Login error:",err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Refresh access token
export const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh Token not provided' });
    }

    try {
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(payload.userId);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Invalid Refresh Token' });
        }

        const newAccessToken = generateAccessToken(user._id);

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(403).json({ message: 'Invalid Refresh Token' });
    }
};

// Logout user
export const logoutUser = async (req, res) => {
    try {
        console.log("Request is coming inside logout user");
        res.clearCookie('accessToken');
        res.status(200).json({ message: 'Logged out successfully', success: true });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};