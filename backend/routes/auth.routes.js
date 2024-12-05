import express from 'express'
import { registerUser,loginUser,refreshAccessToken,logoutUser, getUserDetails, getAllUsersDetails, updateUser } from '../controllers/auth.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/cloudinary.middleware.js';
import { createProduct, getAllProducts, getCatagoryWiseProduct, getCatagoryWiseProducts, getFilteredProduct, getProductDetails, searchProduct, updateProduct } from '../controllers/product.controller.js';
import { addToCart, getCart, removeFromCart, toggleSelectCart } from '../controllers/cart.controller.js';
import { initiatePayment, verifyPayment } from '../controllers/payment.controller.js';

const router = express.Router();

// defining the routes of user controller
router.post('/register',upload.single('image'),registerUser);
router.post('/login', loginUser);
router.get('/user-details', authenticateToken,getUserDetails);
router.post('/refresh', refreshAccessToken);
router.post('/logout', authenticateToken, logoutUser);
router.get('/all-users-details',authenticateToken,getAllUsersDetails);
router.post('/update-user-details/:userId',authenticateToken,updateUser);

router.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.user });
});

// defining the routes of product controller
router.post('/upload-product',authenticateToken,createProduct);
router.get('/get-products',getAllProducts);
router.post('/update-product/:userId',authenticateToken,updateProduct);
router.get('/catagorywise-product',getCatagoryWiseProduct);
router.put('/catagorywise-products',getCatagoryWiseProducts);
router.put('/productdetails',getProductDetails);
router.get('/search',searchProduct);
router.get('/get-filtered-products',getFilteredProduct);

// defing the routes of the cart controller
router.post('/add-to-cart',authenticateToken,addToCart);
router.get('/get-cart-details',authenticateToken,getCart);
router.put('/toggle-selected-cart',authenticateToken,toggleSelectCart);
router.post('/remove-cart-item',authenticateToken,removeFromCart);

// define the payment routes
router.post('/initiate-payment',authenticateToken,initiatePayment)
router.post('/verify-payment',authenticateToken,verifyPayment)

export default router;