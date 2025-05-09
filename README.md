# Backend working
- src
  - connections
    - pg.connection.js
  - controllers
    - ai.controller.js
    - chat.controller.js
    - comment.controller.js
    - comment.like.controller.js
    - friend.controller.js
    - post.controller.js
    - post.like.controller.js
    - request.controller.js
    - row.controller.js
    - Users.controller.js
  - middlewares
    - auth.middleware.js
    - multer.middleware
  - models
    - blocked.model.js
    - chat.model.js
    - comment.like.model.js
    - comment.model.js
    - deleteAccount.model.js
    - friends.model.js
    - group.model.js
    - otp.model.js
    - post.like.model.js
    - request.model.js
    - status.model.js
    - user.model.js
  - routes
    - ai.route.js
    - calling.route.js
    - chat.route.js
    - comment.like.route.js
    - comment.route.js
    - friend.route.js
    - post.like.route.js
    - post.route.js
    - request.route.js
    - row.route.js
    - user.route.js
  - utils
    - AsyncHandler.js
    - Cloudinary
    - GenerateToken.js
    - SendMail.js
 - app.js
 - index.js
 - socket.io
 - package.json

- ENV File setup
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

# ──────────────────────────────────────
# 📧 Email Credentials (for nodemailer)
# ──────────────────────────────────────
EMAIL=your_email@example.com
EMAIL_PASSWORD=your_app_password_here

# ──────────────────────────────────────
# ☁️ Cloudinary Configuration
# ──────────────────────────────────────
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name

# ──────────────────────────────────────
# 🛢️ PostgreSQL Database Config
# ──────────────────────────────────────
DATABASE_NAME=mybook
POSTGRES_USER=your_postgres_username
POSTGRES_PASSWORD=your_postgres_password
DATABASE_HOST=localhost
DATABASE_PORT=5432


# Frontend
## Home Page
![Home Page](./mybook/home.PNG)

## Chat Page
![Chat Page](./mybook/chat%20dialog.PNG)
## Post Page
![Own](./mybook/own%20post.PNG)
![Ai](./mybook/ai%20post.PNG)
