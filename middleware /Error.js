const ErrorHandler = require('../utils/ErrorHandler');

module.exports = (err , req , res , next) => {

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "INTERNAL SERVER ERROR";

    // Invalid mongo id
    if(err.name === 'CastError') {
        const message = `Resource not found , invalid : ${err}`;
        err = new ErrorHandler(message , 400);
    }

    // Duplicate key error
    if(err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} error`;
        err = new ErrorHandler(message , 400);
    }

    // Invalid JWT token
    if(err.name === 'JsonWebTokenError') {
        const message = `Invalid JWT token , try again`;
        err = new ErrorHandler(message , 400);
    }

    // Expired JWT token
    if(err.name === 'TokenExpiredError') {
        const message = `Token expired , trye again`;
        err = new ErrorHandler(message , 400);
    }

    res.status(err.statusCode).json({
        succes : false,
        message : err.message
    })

}
