import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    paymentMethod: { type: String, enum: ['card', 'UPI', 'netbanking', 'wallet'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentAmount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
})

const Payment = mongoose.model('Payment',paymentSchema)
export default Payment