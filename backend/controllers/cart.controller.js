import Cart from "../models/cart.model.js";

// Add to Cart
export const addToCart = async (req, res) => {
    const {productId, quantity} = req.body;
    const userId = req.user;
    console.log("user Id for in addToCart Controller",userId);
    try {
        let cart = await Cart.findOne({ userId });
        let message = ""
        let currentProduct = {}
        if (cart) {
            // Check if product already exists in the cart
            const productIndex = cart.products.findIndex(p => p.productId == productId);
            if (productIndex > -1) {
                let productItem = cart.products[productIndex];
                productItem.quantity += quantity;
                cart.products[productIndex] = productItem;
                message = `You have added this products ${productItem.quantity} times`
                currentProduct = productItem
                console.log("Cart details:",productItem);
            } else {
                cart.products.push({ productId, quantity });
                message = `New item added to cart`
            }
        } else {
            cart = new Cart({
                userId,
                products: [{ productId, quantity }]
            });
        }
        await cart.save();
        // customized message to the frontend
        console.log("Custom message:",message);
        res.status(200).json({
            success: true,
            message,
            data: cart,
            currentProduct
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const toggleSelectCart = async(req,res)=>{
    console.log("Its coming inside the toggle selection of the cart");
    const {productId} = req.body;
    console.log("Product Id",productId)
    const userId = req.user;
    try {
        let cart = await Cart.findOne({ userId }).populate('products.productId');
        console.log("Current cart details",cart);
        let currentProduct = {}
        if (cart) {
            // Check if product already exists in the cart
            const productIndex = cart.products.findIndex(p => p.productId._id.toString() == productId);
            console.log("Product Index",productIndex);
            if (productIndex > -1) {
                let productItem = cart.products[productIndex];
                console.log("Cart details:",productItem);
                productItem.isItemSelected = !productItem.isItemSelected;
                cart.products[productIndex] = productItem;
                currentProduct = productItem
                console.log("Current Cart Item details:",productItem);
            }
        }
        await cart.save();
        // customized message to the frontend
        res.status(200).json({
            success: true,
            message:"Cart has been updated",
            data: cart,
            currentProduct
        });
    } catch (error) {
        console.log("Error in toggle updation of cart",error);
        res.status(500).json({ error: error.message });
    }
}

// Remove from Cart
export const removeFromCart = async (req, res) => {
    const {productId } = req.body;
    const userId = req.user;

    try {
        let cart = await Cart.findOne({ userId });

        if (cart) {
            cart.products = cart.products.filter(p => p.productId != productId);

            await cart.save();
            res.status(200).json({success:true,cart});
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch Cart
export const getCart = async (req, res) => {
    const userId = req.user;

    try {
        const cart = await Cart.findOne({ userId }).populate('products.productId');

        if (cart) {
            res.status(200).json({
                success: true,
                message: 'Cart updated successfully',
                data: cart
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Cart updated is not successfully',
                data: cart
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
