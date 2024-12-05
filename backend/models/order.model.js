import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    orderItems: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            price:{type:Number,required:true}
        },
    ],
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        postalCode: String,
    },
    totalQuantity:{type:Number,required:true},
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentSessionId:{type:String},
    orderStatus: { type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled'], default: 'processing' },
    paymentMethod:{type:String},
    placedAt: { type: Date, default: Date.now },
})

const Order = mongoose.model('Order',orderSchema)
export default Order