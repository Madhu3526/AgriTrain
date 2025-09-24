import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./agritrain.db")

# JWT configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-change-this-in-production-12345")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# CORS configuration
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173"
]

# Application configuration
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
