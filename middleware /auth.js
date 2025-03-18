
const User = require('../models/userModel');
const ErrorHandler = require('../utils/ErrorHandler');
const jwt = require('jsonwebtoken');
const catchAsyncErrors = require('./catchAsyncErrors');

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("please login to access these resources" , 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id)

    next()

})
