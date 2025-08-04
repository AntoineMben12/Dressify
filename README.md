# Dressify - Full-Stack E-commerce Dashboard

A modern, responsive e-commerce platform with a comprehensive dashboard for managing posts and products. Built with React, Node.js, Express, and MongoDB.

## 🚀 Features

### Frontend
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI/UX**: Glassmorphism effects, smooth animations with GSAP
- **Authentication**: Secure login/signup with JWT tokens
- **Dashboard**: Comprehensive content management system
- **Product Catalog**: Interactive product browsing with filters
- **Blog System**: Dynamic blog with search and categories
- **Animations**: GSAP scroll animations and interactive elements

### Backend
- **RESTful API**: Express.js with MongoDB
- **Authentication**: JWT-based secure authentication
- **Data Models**: User, Post, and Product schemas
- **Security**: Helmet, CORS, rate limiting, input validation
- **File Upload**: Multer integration for image handling
- **Error Handling**: Comprehensive error management

### Dashboard Features
- **Overview**: Real-time stats and recent activity
- **Post Management**: Create, view, and manage blog posts
- **Product Management**: Add and track products with inventory
- **User Analytics**: Views, sales, and engagement metrics
- **Modal Forms**: Intuitive content creation interface

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router DOM
- GSAP (GreenSock Animation Platform)
- Tailwind CSS
- FontAwesome Icons
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation
- Helmet for security headers
- CORS for cross-origin requests
- express-rate-limit for API protection

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/dressify
JWT_SECRET=your-super-secure-jwt-secret-key-here
PORT=5000
CLIENT_URL=http://localhost:3000
UPLOAD_PATH=uploads/
MAX_FILE_SIZE=5242880
```

### Frontend Setup
```bash
cd frontend
npm install
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```

### Start Frontend Server
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🧪 Testing

Run the test suite to verify full-stack functionality:
```bash
node test-app.js
```

This will test:
- Server health and connectivity
- User authentication (signup/login)
- Protected routes
- Post and product CRUD operations
- Frontend accessibility

## 📱 Usage

### Getting Started
1. Open http://localhost:3000 in your browser
2. Click "Sign Up" to create a new account
3. Or use the demo account: `demo@dressify.com` / `DemoPass123!`
4. Access the Dashboard to manage your content

### Dashboard Navigation
- **Overview**: View your content statistics and recent activity
- **Posts**: Manage blog posts with categories and status
- **Products**: Add and track products with inventory management

### Creating Content
- Click "Add Post" or "Add Product" buttons in respective sections
- Fill out the modal forms with required information
- Submit to save to your account

## 🔐 Authentication

The application uses JWT-based authentication:
- Tokens are stored in localStorage
- Protected routes require valid authentication
- Automatic redirect to login for unauthenticated users
- Session persistence across browser refreshes

## 🎨 Design Features

### Animations
- GSAP scroll-triggered animations
- Smooth page transitions
- Interactive hover effects
- Modal entrance/exit animations

### Responsive Design
- Mobile-first approach
- Breakpoint-optimized layouts
- Touch-friendly interface
- Accessible navigation

### UI Components
- Glassmorphism design elements
- Gradient backgrounds
- Professional color scheme
- Consistent typography

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/my-posts` - Get user's posts
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/my-products` - Get user's products
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration
- Security headers with Helmet
- Protected API routes

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Configure environment variables for production
3. Deploy to your preferred platform (Heroku, Railway, etc.)

### Frontend Deployment
1. Build the React application: `npm run build`
2. Deploy to your preferred static hosting (Netlify, Vercel, etc.)
3. Update API URLs for production environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- GSAP for amazing animations
- Tailwind CSS for utility-first styling
- MongoDB for flexible data storage
- Express.js for robust backend framework
- React for powerful frontend development

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

---

**Dressify** - Empowering fashion entrepreneurs with modern e-commerce tools.
