# UAP - Unified Access Platform

UAP is a Single Sign-On (SSO) web application built with React and Node.js that provides centralized authentication services.

## Overview

Unified Access Platform (UAP) is a powerful SSO solution designed to simplify and secure authentication across multiple applications. With multi-factor authentication (MFA), role-based access control (RBAC), and seamless integrations, UAP enhances security while streamlining user access. By eliminating password fatigue and reducing security risks, UAP empowers organizations to improve productivity, compliance, and user experience.

## Architecture

### Frontend
- Built with React.js and TailwindCSS
- Modern UI/UX design
- Responsive web interface
- Secure token management

### Backend
- Node.js server with Express.js
- RESTful API endpoints
- JWT authentication
- Session management
- OAuth 2.0 for authentication protocols

### Database
- MongoDB for user data storage

### Security
- HTTPS encryption
- Password hashing using bcrypt
- CSRF protection with secure cookies
- Rate limiting for API endpoints
- Email-based Multi-Factor Authentication (MFA)
- Session management with JWT tokens
- Secure cookie configuration for cross-domain support
- Real-time login history tracking

## Features

### User Features
- Single Sign-On (SSO): Access multiple apps with one login
- User Dashboard: View accessible applications and login activity
- Multi-Factor Authentication (MFA):
  - Email-based OTP verification
  - 2-minute expiration for MFA tokens 
  - Optional MFA toggle for enhanced security
- Google OAuth Integration
- Login History Tracking
- Password Reset Functionality

### Admin Features
- Role-Based Access Control (RBAC): Assign and manage user roles
- Security & Compliance: 
  - Detailed login logs
  - User activity auditing
  - MFA enforcement controls
- User Management:
  - Create and manage users
  - Toggle MFA for users
  - Assign roles and permissions
- Organization Management:
  - Multi-tenant support
  - Organization-specific settings
- Integration with APIs: Supports OAuth for enterprise authentication

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for user data storage)

## Installation

1. Clone the repository
```bash
git clone [repository-url]
cd UAP
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd server
npm install
```

4. Set up environment variables
Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Running the Application

1. Start the backend server
```bash
cd server
npm start
```

2. Start the frontend application
```bash
cd ..
npm start
```

The application will be available at `http://localhost:3000`

## API Documentation

Backend API endpoints are organized into four main groups:

### User Endpoints (/api/user)
- User authentication and profile management

### MFA Endpoints (/api/mfa)
- Multi-factor authentication services

### Admin Endpoints (/api/admin)
- Administrative functions and user management

### Organization Endpoints (/api/organization)
- Organization management and settings

For detailed API documentation and available methods for each endpoint, refer to the API documentation in the server/routes directory.

## Project Structure

```
├── public/                 # Static files
│   ├── index.html         # Main HTML file
│   └── assets/            # Images and other assets
├── src/                   # Frontend source code
│   ├── components/        # React components
│   │   ├── AdminDashboard.js
│   │   ├── Dashboard.js
│   │   ├── Home.js
│   │   ├── Login.js
│   │   └── ...
│   ├── Images/           # Frontend images
│   ├── redux/            # Redux state management
│   │   ├── store.js
│   │   ├── userActions.js
│   │   └── userReducer.js
│   └── App.js            # Main React component
├── server/               # Backend source code
│   ├── config/           # Configuration files
│   │   └── db.js        # Database configuration
│   ├── controllers/      # Route controllers
│   │   ├── admin.js
│   │   ├── mfaController.js
│   │   ├── user.js
│   │   └── ...
│   ├── middleware/       # Express middleware
│   │   ├── auth.js
│   │   └── admin.js
│   ├── models/          # Database models
│   │   ├── user.js
│   │   └── organization.js
│   ├── routes/          # API routes
│   │   ├── admin.js
│   │   ├── mfa.js
│   │   └── user.js
│   ├── utils/           # Utility functions
│   │   └── email.js
│   └── server.js        # Express app entry point
├── package.json         # Frontend dependencies
└── server/package.json  # Backend dependencies
```

## Security

- JWT for secure token management
- Password hashing using bcrypt
- HTTPS encryption in production
- CSRF protection
- Rate limiting for API endpoints

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Team Members

- Bhawani Shankar Sarswat (22JE0246)  
- Ashish Singh (22JE0188)
- Ashok Mahala (22JE0190)  
- Ashish Singh (22JE0187)  