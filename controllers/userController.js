const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel');
const sendToken = require('../utils/sendToken');

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Enter your email and password", 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler("Please enter valid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Please enter valid email or password", 401));
    }

    sendToken(user, 200 , "Login Successful", res);
});

// Logout user
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged Out"
    });
});

// Get user details
exports.getUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorHandler("User not found", 401));
    }

    res.status(200).json({
        success: true,
        user
    });
});


// Update profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    // Destructure fields from request body
    const { firstName, lastName } = req.body;

    // Find the user and update their profile
    const user = await User.findByIdAndUpdate(
        req.user.id, 
        { firstName, lastName }, 
        {
            new: true,         // Return the updated document
            runValidators: true // Run validators on the updated fields
        }
    );

    sendToken(user , 200 , "Profile updated successfully" , res);
});

// Delete profile
exports.deleteProfile = catchAsyncErrors(async( req , res , next ) => {

    const { password } = req.body;

    const user = await User.findById( req.user.id ).select('+password');

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler("Password doesn't match" , 400));
    }

    await User.findByIdAndDelete( req.user.id );

    res.status(200).json({
        success : true,
        message : "Profile deleted successfully"
    })

})
