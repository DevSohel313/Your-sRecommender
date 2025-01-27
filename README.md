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

- React.js
- Redux for state management
- Material-UI components
- Responsive design
- Google Maps integration

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
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Environment Variables
   Create `.env` files in both frontend and backend directories:

Backend `.env`:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

Frontend `.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Run the application

```bash
# Run backend (from backend directory)
npm start

# Run frontend (from frontend directory)
npm start
```

## 📱 Usage

1. **Registration/Login**

   - Create a new account or login with existing credentials
   - Reset password if forgotten

2. **Creating Places**

   - Click on "Add Place" button
   - Fill in place details (title, description, address)
   - Upload images
   - Submit to share with community

3. **Interacting with Places**
   - Browse places on the homepage
   - Use search functionality to find specific places
   - Like/dislike places
   - Leave comments
   - Share places with others

## 🔐 API Endpoints

### Authentication

```
POST /api/users/signup - Register new user
POST /api/users/login - User login
POST /api/users/reset-password - Password reset
```

### Places

```
GET /api/places - Get all places
GET /api/places/search - search for places
GET /api/places/user/:uid - Get places of particular user
GET /api/places/search - search for places
GET /api/places/:pid - Get specific place
POST /api/places - Create new place
PATCH /api/places/:id - Update place
DELETE /api/places/:id - Delete place
```

### Social

```
POST /api/places/:id/like - Like/unlike place
POST /api/places/:id/comment - Add comment
GET /api/places/:id/comments - Get place comments
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
