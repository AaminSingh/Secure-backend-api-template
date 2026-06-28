# Secure Backend API Boilerplate

A production-ready Node.js backend template utilizing Express and MongoDB. This project provides a complete authentication and authorization flow, designed with clean architecture and security in mind.

## 🚀 Features
*   **User Authentication:** Registration, login, and secure logout.
*   **JWT Security:** Implementation of Access and Refresh tokens for secure session management.
*   **Email Verification:** Automated email dispatch using Nodemailer and Mailgen for account verification.
*   **Password Management:** Secure password reset and recovery flows.
*   **Data Validation:** Middleware-level request validation using `express-validator`.
*   **Standardized Responses:** Custom `ApiResponse` and `ApiError` classes for consistent frontend consumption.

## 🛠️ Tech Stack
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB & Mongoose
*   **Authentication:** JSON Web Tokens (JWT) & bcryptjs
*   **Email Services:** Nodemailer, Mailtrap

## ⚙️ Environment Variables
Create a `.env` file in the root directory and add the following:

MONGO_URI=your_mongodb_connection_string
PORT=8000
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
MAILTRAP_SMTP_HOST=your_mailtrap_host
MAILTRAP_SMTP_PORT=your_mailtrap_port
MAILTRAP_SMTP_USER=your_mailtrap_user
MAILTRAP_SMTP_PASSWORD=your_mailtrap_password
FORGOT_PASSWORD_REDIRECT_URL=http://localhost:3000/forgot-password


## 🏃‍♂️ Run Locally

1. Clone the project:
   `git clone https://github.com/yourusername/your-repo-name.git`

2. Install dependencies:
   `npm install`

3. Start the development server:
   `npm run dev`

## 📡 Core API Endpoints
*   `GET /api/v1/healthcheck` - Check server status
*   `POST /api/v1/auth/register` - Register a new user
*   `POST /api/v1/auth/login` - Authenticate user and issue tokens
*   `POST /api/v1/auth/logout` - Clear user tokens (Secured)
*   `POST /api/v1/auth/refresh-token` - Issue a new access token