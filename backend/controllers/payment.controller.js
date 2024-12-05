import Stripe from 'stripe'
import Order from '../models/order.model.js'
import Payment from '../models/payment.model.js';

// Iniatialize the stripe with stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const initiatePayment = async (req, res) => {
    const { cartItems, totalAmount } = req.body;
    console.log("Coming inside the make payment method");
    try {
        // Validate if cart is not empty
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty.' });
        }

        // Calculate subtotal from selected items
        const calculatedSubtotal = cartItems.reduce((acc, item) => acc + (item.productId.sellingPrice * item.quantity), 0);

        // Ensure the total amount matches
        if (calculatedSubtotal !== totalAmount) {
            console.log("Total mismatch");
            return res.status(400).json({ success: false, message: 'Total amount mismatch.' });
        }
        console.log("It has come before session");
        // Create Stripe session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: cartItems.map(item => ({
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: item.productId.productName,
                    },
                    unit_amount: item.productId.sellingPrice * 100, // Stripe uses cents
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/payment-success/{CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/checkout`,
        });
        console.log('Payment Session details:',session);
        // Return the session ID and payment URL to the frontend
        res.json({ success: true, sessionId: session.id, paymentUrl: session.url });
    } catch (error) {
        console.error("Error in initiating payment:", error);
        res.status(500).json({ success: false, message: 'Payment initiation failed.' });
    }
};


// Payment Verification and Order Creation
export const verifyPayment = async (req, res) => {
    const { sessionId, cartItems ,address,totalQuantity} = req.body;

    try {
        // Retrieve Stripe session
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            // Create order after payment success
            const orderItems = cartItems.map(item => ({
                productId: item.productId._id,  // Assuming the frontend sends the product ID
                quantity: item.quantity,
                price: item.productId.sellingPrice,
            }));

            const newOrder = new Order({
                userId: req.user,  // Assuming user is available in req.user
                orderItems,
                address,
                totalQuantity,
                totalAmount: session.amount_total / 100,
                paymentStatus: 'completed',
                paymentSessionId: session.id,
                orderStatus: 'processing',
                paymentMethod: 'Stripe',
            });

            // Save the order to the database
            await newOrder.save();
            // Clear the cart on the frontend side if needed
            console.log("Order confirmed",newOrder);
            // creating one Payment instance also after successful and verifed payment
            const newPayment = new Payment({
                orderId:newOrder._id,
                userId:req.user,
                paymentMethod:'card',
                paymentStatus:'completed',
                paymentAmount:session.amount_total / 100
            })

            await newPayment.save();
            console.log("Payment confirmed",newPayment);
            res.json({
                success: true,
                message: 'Payment verified and order placed.',
                order: newOrder,
                payment:newPayment
            });
        } else {
            res.status(400).json({ success: false, message: 'Payment not successful.' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ success: false, message: 'Payment verification failed.' });
    }
};  