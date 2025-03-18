const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');

// Update email
exports.updateEmail = catchAsyncErrors( async (req , res , next) => {

    // password for the user verification
    const { newEmail , password } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler("Password doesn't match" , 400));
    }

    const existingUser = await User.findOne({ email : newEmail });

    if(existingUser) {
        return next(new ErrorHandler("User already exists with this email" , 400));
    }

    user.tempEmail = newEmail;
    const otp = await user.generateOTP();
    await user.save({ validateBeforeSave : false });


    const message = `Dear ${user.firstName},

Please verify your new email address by using the following OTP:

${otp}

This OTP is valid for 5 minutes. If you did not request this change, please ignore this email.

Best regards,
Tanwar App Team`;

    try {

        await sendEmail({
            email : newEmail,
            subject : 'Email Update OTP',
            message,
        })

        res.status(200).json({
            success : true,
            message : "Email verification OTP sent to new email address."
        })
        
    } catch (error) {

        user.tempEmail = undefined;
        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save({ validateBeforeSave : false });
        console.log(error.stack)
        return next(new ErrorHandler("Email could not be sent" , 500));
        
    }
})

// VerifyEmailUpdateOTP
exports.verifyEmailUpdateOTP = catchAsyncErrors(async( req , res , next ) => {

    const { otp } = req.body;

    const user = await User.findById(req.user.id);

    if(user.otp !== otp || user.otpExpire < Date.now()) {
        return next(new ErrorHandler("OTP invalid or has expired" , 400));
    }

    user.email = user.tempEmail;
    user.tempEmail = undefined;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.status(200).json({
        success : true,
        message : "Email updated successfully"
    })

})
