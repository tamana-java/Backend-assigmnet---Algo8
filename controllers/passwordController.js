const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel');
const TempUser = require('../models/tempUserModel');
const sendToken = require('../utils/sendToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// Forgot password
exports.forgotPassWord = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const passwordResetURL = `${req.protocol}://${req.get('host')}/auth/user/reset/Password/${resetToken}`;

    const message = `Dear ${user.firstName},

We received a request to reset your password for your [Your App Name] account associated with this email address. If you did not make this request, please ignore this email.

To reset your password, please click on the link below or copy and paste it into your web browser:

${passwordResetURL}

This link will expire in 30 minutes. After that, you will need to request a new password reset.

If you have any issues or did not request this, please contact our support team immediately.

Best regards,
Tanwar Support Team

---

Note: Please do not reply to this email as it is automatically generated.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler("Email could not be sent", 500));
    }
});

// Reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler("Password reset token is expired or invalid", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords do not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password reset successful"
    });
});

// Update password
exports.updatePassword = catchAsyncErrors( async (req, res, next) => {

    const user = await User.findById(req.user.id).select('+password');

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched) {
        return next( new ErrorHandler( "Old password doesn't match" , 400))
    }

    if(req.body.newPassword !== req.body.confirmNewPassword) {
        return next( new ErrorHandler( "New password doesn't matched with Confirm new password"));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user , 200 , "Password updated successfuly" , res);

})
