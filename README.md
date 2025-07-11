# MyBook - Social Media Platform

## 📝 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Production](#production)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Overview

MyBook is a modern, full-stack social media platform that combines traditional social networking features with AI-powered content generation. Built with scalability and user experience in mind, it offers real-time interactions, secure authentication, and cloud-based media storage.

### Key Features
- Real-time chat and notifications using Socket.io
- AI-powered post generation
- Secure user authentication with JWT
- Cloud-based image storage
- Responsive design with modern UI/UX
- PostgreSQL database with Sequelize ORM

## ✨ Features

### Core Features
- **User Management**
  - Secure registration and login
  - Email verification
  - Profile management
  - Account deletion
  - User status (online/offline)

- **Social Interactions**
  - Create and manage posts
  - Like and comment on posts
  - Friend system with requests
  - Real-time chat
  - AI-generated content

- **Media Handling**
  - Image uploads via Cloudinary
  - Profile pictures
  - Post attachments
  - Chat media sharing

- **Security**
  - JWT authentication
  - Password encryption
  - Protected routes
  - Rate limiting
  - Input validation

## 🛠 Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Real-time:** Socket.io
- **Authentication:** JWT, bcrypt
- **File Upload:** Multer
- **Email:** Nodemailer
- **Cloud Storage:** Cloudinary
- **Environment:** dotenv

### Frontend
- **Framework:** React (Vite)
- **State Management:** Redux/Zustand
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Real-time:** Socket.io-client
- **Animations:** GSAP
- **Icons:** FontAwesome
- **Build Tool:** Vite

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Git

## 💻 Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:jaykmarBCET/mybook.git
   cd mybook
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up Environment Variables**
   - Copy the `.env.example` to `.env` in the backend directory
   - Update the variables with your values (see Environment Variables section)

5. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb mybook
   # Run migrations (if any)
   npm run migrate
   ```

## 🔑 Environment Variables

Create a `.env` file in the backend directory and copy-paste the following:

```env
# ──────────────────────────────────────
# 🚀 App Settings
# ──────────────────────────────────────
PORT=3000
url=http://localhost:3000
FRONTEND_URL=http://localhost:3000

# ──────────────────────────────────────
# 🔐 Security
# ──────────────────────────────────────
SECURE_KEY=your_secure_key_here
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=24h

# ──────────────────────────────────────
# 📧 Email Configuration (Nodemailer)
# ──────────────────────────────────────
EMAIL=your_email@example.com
EMAIL_PASSWORD=your_app_password_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# ──────────────────────────────────────
# ☁️ Cloudinary Configuration
# ──────────────────────────────────────
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name

# ──────────────────────────────────────
# 🛢️ PostgreSQL Database Configuration
# ──────────────────────────────────────
DATABASE_NAME=mybook
POSTGRES_USER=your_postgres_username
POSTGRES_PASSWORD=your_postgres_password
DATABASE_HOST=localhost
DATABASE_PORT=5432

# ──────────────────────────────────────
# 🤖 AI Configuration (if applicable)
# ──────────────────────────────────────
AI_API_KEY=your_ai_api_key_here
AI_MODEL=your_ai_model_name
```

## 📁 Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── connections/          # Database connections
│   │   └── pg.connection.js  # PostgreSQL connection
│   ├── controllers/          # Business logic
│   │   ├── ai.controller.js
│   │   ├── chat.controller.js
│   │   ├── comment.controller.js
│   │   ├── friend.controller.js
│   │   ├── post.controller.js
│   │   └── user.controller.js
│   ├── middlewares/          # Custom middlewares
│   │   ├── auth.middleware.js
│   │   └── multer.middleware.js
│   ├── models/              # Database models
│   │   ├── user.model.js
│   │   ├── post.model.js
│   │   ├── chat.model.js
│   │   └── comment.model.js
│   ├── routes/              # API routes
│   │   ├── ai.route.js
│   │   ├── chat.route.js
│   │   ├── post.route.js
│   │   └── user.route.js
│   └── utils/               # Helper functions
│       ├── AsyncHandler.js
│       ├── Cloudinary.js
│       ├── GenerateToken.js
│       └── SendMail.js
├── app.js                   # Express app setup
├── index.js                 # Server entry point
└── socket.js               # Socket.io configuration
```

### Frontend Structure
```
frontend/
├── src/
│   ├── api/                # API integration
│   │   ├── auth.api.js
│   │   ├── chat.api.js
│   │   └── post.api.js
│   ├── components/         # Reusable components
│   │   ├── common/
│   │   ├── layout/
│   │   └── features/
│   ├── pages/             # Page components
│   │   ├── Home/
│   │   ├── Chat/
│   │   └── Profile/
│   ├── store/             # State management
│   │   ├── slices/
│   │   └── index.js
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Helper functions
│   └── styles/            # Global styles
├── public/                # Static assets
└── index.html            # Entry HTML
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Post Endpoints
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post
- `POST /api/posts/:id/like` - Like a post
- `POST /api/posts/:id/comment` - Comment on a post

### Chat Endpoints
- `GET /api/chat` - Get chat history
- `POST /api/chat` - Send a message
- `GET /api/chat/:id` - Get specific chat

### User Endpoints
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/friend` - Send friend request
- `PUT /api/users/friend/:id` - Accept friend request

## 🚀 Development

### Running Backend
```bash
cd backend
npm run dev
```

### Running Frontend
```bash
cd frontend
npm run dev
```

### Running Both (Concurrently)
```bash
# From root directory
npm start
```

## 🏗 Production

### Building Frontend
```bash
cd frontend
npm run build
```

### Running Production
```bash
# Backend
cd backend
npm start

# Frontend (serve the dist folder)
cd frontend
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
## 📸 Screenshots

### Home Page
![Home Page](./mybook/home.PNG)

### Chat Page
![Chat Page](./mybook/chat%20dialog.PNG)

### Post Page (Own Post)
![Own Post](./mybook/own%20post.PNG)

### Post Page (AI Post)
![AI Post](./mybook/ai%20post.PNG)
