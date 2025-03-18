const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel');
const TempUser = require('../models/tempUserModel');
const sendToken = require('../utils/sendToken');
const sendEmail = require('../utils/sendEmail');

// Register User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    // Check if a TempUser with the same email already exists
    const existingUser = await TempUser.findOne({ email });

    if (existingUser) {
        await TempUser.findByIdAndDelete(existingUser._id);
    }

    const user = await User.findOne({email});

    if(user) {
        return next(new ErrorHandler("User already Exist with this email" , 400));
    }

    const tempUser = await TempUser.create({
        firstName,
        lastName,
        email,
        password
    });

    const otp = await tempUser.generateOTP();
    await tempUser.save({ validateBeforeSave: false });

    const message = `Dear ${tempUser.firstName},

Please verify your email address by using the following OTP:

${otp}

This OTP is valid for 5 minutes. If you did not register with us, please ignore this email.

Best regards,
Rahul Tanwar`;

    try {
        await sendEmail({
            email: tempUser.email,
            subject: "Email Verification OTP",
            message
        });

        res.cookie('tempUserID', tempUser._id.toString(), {
            expires: new Date(Date.now() + 5 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(200).json({
            success: true,
            message: "Registration successful! Please check your email for the OTP to verify your account.",
        });

    } catch (error) {
        await TempUser.findByIdAndDelete(tempUser._id); // Delete the temp user if email sending fails

        return next(new ErrorHandler("Email could not be sent", 500));
    }
});

// OTP verify
exports.verifyOTP = catchAsyncErrors( async (req , res , next) => {

    const { otp } = req.body;
    const {tempUserID} = req.cookies;

    const tempUser = await TempUser.findOne({
        _id : tempUserID,
        otp,
        otpExpire : { $gt : Date.now()}
    })

    if(!tempUser) {
        return next( new ErrorHandler("OTP is invalid or has expired" , 400));
    }

    const user = await User.create({
        firstName : tempUser.firstName,
        lastName : tempUser.lastName,
        email : tempUser.email,
        password : tempUser.password,
        emailVerified : true
    })

    await TempUser.findByIdAndDelete(tempUserID);
    res.clearCookie('tempUserID');

    sendToken(user , 200 , "Email verified successfully!" , res);

})
