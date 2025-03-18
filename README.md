# Backend-assigmnet---Algo8

## Overview
This is a **Node.js and Express.js** backend authentication system using **MongoDB** for database management. It includes user registration, email verification, login, authentication, profile management, password reset, and more.

## Features
✅ User Registration with Email Verification (OTP)

✅ Secure Authentication using JWT

✅ User Login & Logout

✅ Profile Management (Update & Delete)

✅ Password Management (Forgot & Reset Password)

✅ Email Update with OTP Verification

✅ Secure Cookies & Error Handling


---

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Email Service**: Nodemailer
- **Security**: dotenv, cookie-parser

---

## Folder Structure
```
backend  
    config
          database.js
          info.env
    controllers  
        authController.js  
        emailController.js  
        passwordController.js  
        userController.js  
    middleware
        auth.js
        catchAsyncErrors.js
        Error.js  
    models
          tempUserModel.js
          userModel.js
    utils
          ErrorHandler.js
          sendEmail.js
          sendToken.js
    routes  
        userRoutes.js
    app.js  
    server.js
    package.json
    package-lock.json  
```

---

## Installation & Setup
### **1️⃣ Clone the repository**
```sh
git clone <repository-url>
cd backend
```

### **2️⃣ Install dependencies**
```sh
npm install
```

### **3️⃣ Set up environment variables**
Create a `.env` file in the root directory and configure it:
```env
PORT=5000
DB_URI=mongodb://127.0.0.1:27017/yourDatabaseName
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_EMAIL=your_email
SMTP_PASSWORD=your_password
```

### **4️⃣ Start the server**
```sh
npm start   # Runs the server normally
npm run dev  # Runs the server with nodemon
```

---

## API Endpoints
### **Auth Routes**
| Method | Endpoint                | Description          |
|--------|-------------------------|----------------------|
| POST   | `/auth/user/register`    | Register a user with OTP |
| POST   | `/auth/user/verifyOTP`   | Verify OTP for registration |
| POST   | `/auth/user/login`       | User login |
| GET    | `/auth/user/logout`      | User logout |

### **User Routes**
| Method | Endpoint                     | Description            |
|--------|------------------------------|------------------------|
| GET    | `/auth/user/getUser`         | Get user details |
| PUT    | `/auth/user/update/profile`  | Update user profile |
| DELETE | `/auth/user/delete/profile`  | Delete user account |

### **Email & Password Routes**
| Method | Endpoint                          | Description             |
|--------|-----------------------------------|-------------------------|
| PUT    | `/auth/user/update/email`        | Update email with OTP  |
| PUT    | `/auth/user/verifyOtp/email`     | Verify email update OTP |
| POST   | `/auth/user/forgot/password`     | Request password reset |
| PUT    | `/auth/user/reset/password/:token` | Reset password  |
| PUT    | `/auth/user/update/password`     | Update password |

---

## Security & Best Practices
🔹 **Use `127.0.0.1` instead of `localhost` for MongoDB connections** to avoid IPv6 issues.  

🔹 **Always store secrets (JWT, DB_URI) in the `.env` file**.  

🔹 **Enable authentication in MongoDB for production** to prevent unauthorized access.  

🔹 **Use `secure: true` in cookies when deploying to production**.  


---

## Contributors
- **Tamana** *(Developer)*

---

## License
This project is licensed under the **MIT License**.
