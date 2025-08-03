# ScyDB API 🎬

A comprehensive movie database API built with Node.js, Express, and MongoDB. ScyDB (Screen Database) provides a robust backend for managing movies, users, reviews, genres, and roles with advanced authentication and authorization features.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Movie Management**: CRUD operations for movies with advanced filtering and search
- **Review System**: Users can review movies with ratings and comments
- **Genre Management**: Dynamic genre system with color coding
- **Role-Based Access**: Three-tier role system (client, admin, super-admin) extra roles can be added
- **User Management**: Profile management and watchlist functionality
- **Rate Limiting**: Protection against abuse with configurable limits
- **Security**: Helmet, CORS, HPP protection, and XSS cleaning
- **File Upload**: Cloudinary integration for image handling
- **Data Seeding**: Pre-populated roles and genres

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: CORS, HPP, XSS-Clean
- **File Storage**: Cloudinary
- **Rate Limiting**: Express Rate Limit
- **Validation**: Custom middleware validation
- **Development**: Nodemon for hot reloading

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/Scylox56/scydb-api.git
cd scydb-api
```
2. **Install dependencies**
```bash
npm install
```
3. **Environment Setup** Create a .env file in the root directory:
```env
DB_URI=mongodb://127.0.0.1:27017/scydb
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=7
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```
4. **Start MongoDB Make sure MongoDB is running on your system.**
5. **Seed the database**
```bash
   npm run seed:import
```
6. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🎯 API Endpoints
- **Authentication**
```
POST /api/v1/auth/signup         - User registration
POST /api/v1/auth/login          - User login
GET  /api/v1/auth/logout         - User logout
GET  /api/v1/auth/check          - Check auth status
```
- **Movies**
```
GET    /api/v1/movies            - Get all movies (with filtering/search)
GET    /api/v1/movies/:id        - Get single movie
POST   /api/v1/movies            - Create movie (admin only)
PATCH  /api/v1/movies/:id        - Update movie (admin only)
DELETE /api/v1/movies/:id        - Delete movie (admin only)
```
- **Reviews**
```
GET    /api/v1/movies/:movieId/reviews     - Get movie reviews
POST   /api/v1/movies/:movieId/reviews     - Create review (authenticated)
PATCH  /api/v1/reviews/:id                 - Update review (owner only)
DELETE /api/v1/reviews/:id                 - Delete review (owner/admin)
GET    /api/v1/reviews/my                  - Get user's reviews
GET    /api/v1/reviews/admin               - Get all reviews (admin)
```
- **Users**
```
GET    /api/v1/users/me                    - Get current user
PATCH  /api/v1/users/updateMe              - Update profile
PATCH  /api/v1/users/updateMyPassword      - Update password
DELETE /api/v1/users/deleteMe              - Deactivate account
POST   /api/v1/users/watchlist/:movieId    - Add to watchlist
DELETE /api/v1/users/watchlist/:movieId    - Remove from watchlist
GET    /api/v1/users                       - Get all users (admin)
GET    /api/v1/users/stats                 - User statistics (admin)
```
- **Genres**
```
GET    /api/v1/genres                      - Get all genres
GET    /api/v1/genres/active               - Get active genres
GET    /api/v1/genres/stats                - Genre statistics
POST   /api/v1/genres                      - Create genre (admin)
PATCH  /api/v1/genres/:id                  - Update genre (admin)
DELETE /api/v1/genres/:id                  - Delete genre (admin)
PATCH  /api/v1/genres/bulk                 - Bulk update genres (admin)
```
- **Roles**
```
GET    /api/v1/roles                       - Get all roles
GET    /api/v1/roles/stats                 - Role statistics
POST   /api/v1/roles                       - Create role (super-admin)
PATCH  /api/v1/roles/:id                   - Update role (super-admin)
DELETE /api/v1/roles/:id                   - Delete role (super-admin)
```

## 🔍 Advanced Features
- **Movie Filtering & Search**
```
GET /api/v1/movies?search=batman           - Search in title, director, cast, description
GET /api/v1/movies?genre=Action            - Filter by genre
GET /api/v1/movies?director=Christopher    - Filter by director
GET /api/v1/movies?cast=Leonardo           - Filter by cast member
GET /api/v1/movies?yearFrom=2020           - Movies from 2020 onwards
GET /api/v1/movies?yearTo=2023             - Movies up to 2023
GET /api/v1/movies?duration=90-120         - Filter by duration range
GET /api/v1/movies?sort=newest             - Sort options: newest, oldest, title, rating
GET /api/v1/movies?page=2&limit=10         - Pagination
```
 **Role-Based Access Control**
- **Client**: Can view movies, create reviews, manage own profile
- **Admin**: All client permissions + manage movies, view all reviews
- **Super-Admin**: All permissions + manage users, roles, and system settings

## 🗂️ Project Structure
```
scydb-api/
├── config/
│   ├── cloudinary.js          # Cloudinary configuration
│   └── db.js                  # Database connection
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── movieController.js     # Movie CRUD operations
│   ├── userController.js      # User management
│   ├── reviewController.js    # Review system
│   ├── genreController.js     # Genre management
│   └── roleController.js      # Role management
├── middlewares/
│   ├── auth.js                # Authentication middleware
│   ├── error.js               # Error handling
│   ├── rateLimiter.js         # Rate limiting config
│   └── validation.js          # Input validation
├── models/
│   ├── User.js                # User schema
│   ├── Movie.js               # Movie schema
│   ├── Review.js              # Review schema
│   ├── Genre.js               # Genre schema
│   └── Role.js                # Role schema
├── routes/
│   ├── authRoutes.js          # Auth endpoints
│   ├── movieRoutes.js         # Movie endpoints
│   ├── userRoutes.js          # User endpoints
│   ├── reviewRoutes.js        # Review endpoints
│   ├── genreRoutes.js         # Genre endpoints
│   └── roleRoutes.js          # Role endpoints
├── utils/
│   ├── APIFeatures.js         # Query helpers
│   ├── appError.js            # Custom error class
│   ├── email.js               # Email utilities
│   └── utils.js               # General utilities
├── app.js                     # Express app setup
├── server.js                  # Server entry point
└── seeder.js                  # Database seeding
```

## 📊 Database Models
**User Schema**
- Name, email, password (hashed)
- Role (client/admin/super-admin)
- Profile photo, watchlist
- Password change tracking
**Movie Schema**
- Title, year, duration, description
- Genre array, director, cast array
- Poster, backdrop, trailer URLs
- Virtual reviews population
**Review Schema**
- Rating (1-10), review text
- User and movie references
- A Constraint (one review per user per movie)
**Genre Schema**
- Name, description, color
- Active status, movie count virtual
**Role Schema**
- Name, description
- Permissions array
- User count tracking
     
## 🔒 Security Features
- JWT Authentication: Secure token-based auth
- Password Hashing: bcryptjs encryption
- Rate Limiting: API abuse prevention
- CORS: Cross-origin request handling
- Helmet: Security headers
- HPP: HTTP Parameter Pollution protection
- XSS Protection: Input sanitization
- Input Validation: Custom middleware validation

## 🧪 Available Scripts
``` bash
npm start              # Start production server
npm run dev            # Start development server with nodemon
npm run seed:import    # Import default roles and genres
npm run seed:delete    # Clear all roles and genres
npm test               # Run tests (placeholder)
```

## 🤝 Contributing
1. Fork the project
2. Create your feature branch (git checkout -b feature/a-feature)
3. Commit your changes (git commit -m 'Added a feature')
4. Push to the branch (git push origin feature/a-feature)
5. Open a Pull Request

## 📝 License
This project is licensed under the MIT License.

👨‍💻 Author
Created with ❤️ by [Scylox56]

🔗 Links
[Live Demo](https://your-link-here.com)

---

⭐ Don't forget to star this repo if you found it helpful!
