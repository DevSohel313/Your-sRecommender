# YourPlaces - Social Place Sharing Platform

![YourPlaces](https://raw.githubusercontent.com/DevSohel313/Your-s_Recommender/main/HomePage.png)

A full-stack MERN application that allows users to discover, share, and interact with interesting places around them.

## 🌟 Features

### Authentication System

- Secure user registration and login
- Password reset functionality
- JWT-based authentication
- Protected routes and authorized access

### Place Management

- Create and share new places
- Advanced search functionality
  - Search by title
  - Search by city
- Rich place descriptions with images
- Location mapping integration

### Social Interactions

- Interactive commenting system
- Like/Dislike functionality
- Real-time updates
- User engagement tracking

### User Profiles

- Customizable user profiles
- Place sharing history
- Activity feed
- User statistics

## 🚀 Tech Stack
### Frontend

- Vite for fast development environment
- React.js
- Context Mangement using ContextAPI
- Material-UI components
- Responsive design
- **OpenLayers** for maps integration
- **LocationIQ** for address translation into coordinates


### Backend

- Node.js & Express.js
- MongoDB with Mongoose
- JWT authentication
- RESTful API architecture

## 🛠️ Installation & Setup

1. Clone the repository

```bash
git clone https://github.com/DevSohel313/Your-s_Recommender.git
cd Your-s_Recommender
```

2. Install dependencies

```bash
# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

3. Environment Variables
   Create `.env` files in both frontend and backend directories:

Backend `.env`:

```env
MONGODB_URI_DEV=Your_Dev_URL
MONGODB_URI_PROD=Your_prod_URL
API_KEY=Your_API_KEY
JWT_SECRET_KEY=YOUR_SECRET_KEY
USER_EMAIL=YourEmail
USER_PASS=YourPass
NODE_ENV=development || production

```

Frontend `.env`:

```env
VITE_BACKENED_UR=http://localhost:5000/api
VITE_IMAGE_URL=http://localhost:5000

```

4. Run the application

```bash
# Run backend (from backend directory)
npm start

# Run frontend (from frontend directory)
npm run dev
```

## 📱 Usage

1. **Registration/Login**
   - Create a new account or login with existing credentials
   - Reset password if forgotten

2. **Creating Places**
   - Click on "Add Place" button
   - Fill in place details (title, description, address)
   - Use **LocationIQ** for automatic address translation into coordinates
   - Upload images
   - Submit to share with the community

3. **Interacting with Places**
   - Browse places on the homepage
   - Use **OpenLayers** maps for interactive location display
   - Use search functionality to find specific places
   - Like/dislike places
   - Leave comments
   - Share places with others


## 🔐 API Endpoints

### Authentication

```
POST /api/users/signup - Register new user
POST /api/users/login - User login
POST /api/users/reset-password/:id/:token - Password reset
POST /api/users/forgot-password - Forgot Password
GET /api/users/hasUsers - Check if users exist
GET /api/users/:userId - Get user by ID
PATCH /api/users/:userId - Update user (Name, Profile image)
```

### Places

```
GET /api/places - Get all places
GET /api/places/search - Search for places
GET /api/places/user/:uid - Get places of a specific user
GET /api/places/:pid - Get specific place by ID
POST /api/places - Create new place
PATCH /api/places/:pid - Update place by ID (Title, Description)
DELETE /api/places/:pid - Delete place by ID
```

### Social

```
GET /api/places/:pid/userrating - Get user’s rating for a place
POST /api/places/:pid/rate - Set/update rating for a place
POST /api/places/:pid/comments - Add comment to a place
GET /api/places/:pid/comments - Get all comments for a place
DELETE /api/places/:pid/comments/:commentId - Delete a specific comment
```

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Dev Sohel

- GitHub: [@DevSohel313](https://github.com/DevSohel313)
- LinkedIn: [@SohelDarwajkar](https://www.linkedin.com/in/sohel-darwajkar/)
