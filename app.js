const express = require('express');
const app = express();
const errorMiddlerware = require('./middleware/Error');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

// user routes
const user = require('./routes/userRoutes');
app.use('/auth' , user);

// Middleware for errors
app.use(errorMiddlerware);

module.exports = app;
