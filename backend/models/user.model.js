import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

// This is the address schema
const addressSchema = new mongoose.Schema({
    street: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    zipCode: {
        type: String,
    },
    country: {
        type: String,
        default:'India'
    },
    phone: {
        type: String,
    },
    isDefault: {
        type: Boolean,
        default: false
    }
});

// This is the main userSchema
// where user will give their details
const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        default: 'default-profile.png'  // You can set a default image if none is provided
    },
    addresses:[addressSchema],
    role:{
        type:String,
        required:true,
        default:"GENERAL"
    },
    refreshToken:{
        type:String,
        default:''
    }
},{timestamps:true})

// Hash the password before saving the user model
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password during login
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User',userSchema);
export default User;