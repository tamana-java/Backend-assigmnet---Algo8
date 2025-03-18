const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({

    firstName : {
        type : String,
        required : [true , "Please enter your first name"],
        maxLength : [10 , "length cannot exceed 10 characters"]
    },

    lastName : {
        type : String,
        maxLength : [10 , "length cannot exceed 10 characters"]
    },

    email : {
        type : String,
        unique : true,
        required : [true , "Please enter your email"],
        validate : [validator.isEmail , "Please enter a valid Email"]
    },
    
    emailVerified : {
        type : Boolean,
        default : false
    },

    password : {
        type : String,
        required : [true , "Please enter your password"],
        minLength : [7 , "Password must contains atleast 7 characters"]
    },

    profilePicture: {
        type: String,
        default: null
    },

    role : {
        type : String,
        default : "user"
    },

    createdAt : {
        type : Date,
        default : Date.now
    },

    otp : String,
    otpExpire : Date,

    resetPasswordToken : String,
    resetPasswordExpire : Date,

    tempEmail : {
        type : String,
        validate : [validator.isEmail , "Enter a valid email"]
    },

    tempEmailVerified : {
        type : Boolean,
        default : false
    }

})

// pre-save hook to hash password before saving
userSchema.pre('save' , async function(next) {
    if(!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password , salt);
    next();
})

// get JWT token
userSchema.methods.getJWTToken = function() {

    return jwt.sign({id : this._id} , process.env.JWT_SECRET , {
        expiresIn : process.env.JWT_EXPIRE
    })

}

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password , this.password);
}

userSchema.methods.generateOTP = async function() {

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    this.otp = otp;
    this.otpExpire = Date.now() + 5*60*1000;

    return otp;

}

userSchema.methods.getResetPasswordToken = function() {

    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPasswordExpire = Date.now() + 5*60*1000;

    return resetToken;

}

const user = mongoose.model('User' , userSchema);

module.exports = user;
