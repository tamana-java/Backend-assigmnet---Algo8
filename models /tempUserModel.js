const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const tempUserSchema = new mongoose.Schema({

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

    otp : String,
    otpExpire : Date,

    createdAt : {
        type : Date,
        default : Date.now,
        expires : '5m'
    },


})

tempUserSchema.methods.generateOTP = async function() {

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    this.otp = otp;
    this.otpExpire = Date.now() + 5*60*1000;

    return otp;

}


const tempUser = mongoose.model('TempUser' , tempUserSchema);

module.exports = tempUser;
