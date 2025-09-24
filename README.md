# AgriTrain - Agricultural Training Platform

A modern agricultural training platform with 360° immersive scenarios, AI-powered guidance, and interactive quizzes. Built with React frontend and FastAPI backend with SQLite database.

## Features

- **360° Immersive Training**: Experience farm scenarios through panoramic views
- **AI-Powered Guidance**: Get personalized recommendations and insights
- **Interactive Quizzes**: Test your knowledge with dynamic assessments
- **Progress Tracking**: Monitor your learning journey across scenarios
- **User Authentication**: Secure login and registration system
- **Voice Assistant**: Hands-free navigation and guidance
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Framer Motion for animations
- React Three Fiber for 3D/360° content
- React Query for data fetching

### Backend

- FastAPI (Python)
- SQLAlchemy ORM
- SQLite database
- JWT authentication
- Pydantic for data validation

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+

### Backend Setup

1. **Install Python dependencies**:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Start the backend server**:

   ```bash
   python run.py
   ```

   The API will be available at `http://localhost:8000`

   - API Documentation: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

### Frontend Setup

1. **Install dependencies**:

   ```bash
   cd AgriTrain
   npm install
   ```

2. **Start the development server**:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

### Windows Quick Start

Use the provided batch files:

- `start_backend.bat` - Starts the backend server
- `start_frontend.bat` - Starts the frontend development server

## Database Schema

The SQLite database includes the following tables:

- **users**: User accounts and authentication
- **scenarios**: Training scenarios with metadata
- **quizzes**: Quiz questions and configurations
- **quiz_attempts**: User quiz submissions and scores
- **user_progress**: User progress tracking

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info

### Scenarios

- `GET /scenarios` - Get all scenarios
- `GET /scenarios/{id}` - Get specific scenario
- `POST /scenarios` - Create new scenario

### Quizzes

- `GET /scenarios/{id}/quiz` - Get scenario quiz
- `POST /quiz-attempts` - Submit quiz attempt
- `GET /users/{id}/quiz-attempts` - Get user quiz attempts

### Progress

- `GET /users/{id}/progress` - Get user progress
- `POST /users/{id}/progress` - Update user progress

## Project Structure

```
AgriTrain/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main FastAPI application
│   ├── models.py           # SQLAlchemy database models
│   ├── schemas.py          # Pydantic schemas
│   ├── database.py         # Database configuration
│   ├── auth.py             # Authentication utilities
│   ├── seed_data.py        # Database seeding
│   └── requirements.txt    # Python dependencies
├── AgriTrain/              # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── pages/          # Page components
│   └── package.json
├── start_backend.bat       # Windows backend starter
├── start_frontend.bat      # Windows frontend starter
└── README.md
```

## Development

### Backend Development

- The backend uses FastAPI with automatic API documentation
- Database migrations are handled automatically
- Seed data is loaded on first run
- JWT tokens are used for authentication

### Frontend Development

- Uses Vite for fast development builds
- TypeScript for type safety
- Context API for state management
- Responsive design with Tailwind CSS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
