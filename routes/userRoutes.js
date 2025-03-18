const express = require('express');
const router = express.Router();

const { registerUser, verifyOTP } = require('../controllers/authController');
const { loginUser, logoutUser, getUser, updateProfile, deleteProfile } = require('../controllers/userController');
const { updateEmail, verifyEmailUpdateOTP } = require('../controllers/emailController');
const { forgotPassWord, resetPassword, updatePassword } = require('../controllers/passwordController');

const { isAuthenticated } = require('../middleware/auth');

// Auth routes
router.post('/user/register', registerUser);
router.post('/user/verifyOTP', verifyOTP);

// User routes
router.post('/user/login', loginUser);
router.get('/user/logout', isAuthenticated, logoutUser);
router.get('/user/getUser', isAuthenticated, getUser);
router.put('/user/update/profile', isAuthenticated, updateProfile);
router.delete('/user/delete/profile', isAuthenticated, deleteProfile);

// Email routes
router.put('/user/update/email', isAuthenticated, updateEmail);
router.put('/user/verifyOtp/email', isAuthenticated, verifyEmailUpdateOTP);

// Password routes
router.post('/user/forgot/password', forgotPassWord);
router.put('/user/reset/password/:token', resetPassword);
router.put('/user/update/password', isAuthenticated, updatePassword);

module.exports = router;
