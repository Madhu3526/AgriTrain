#!/usr/bin/env python3
"""
AgriTrain Backend Server
Run this script to start the FastAPI server with database initialization.
"""

import uvicorn
from database import engine
from models import Base
from seed_data import seed_database
from sqlalchemy.orm import Session

def init_database():
    """Initialize the database with tables and seed data."""
    print("Initializing database...")
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Seed the database with initial data
    db = Session(engine)
    try:
        seed_database(db)
    finally:
        db.close()
    
    print("Database initialization complete!")

if __name__ == "__main__":
    print("Starting AgriTrain Backend Server...")
    print("Using uvicorn ASGI server with FastAPI")
    
    # Initialize database
    init_database()
    
    # Start the server with uvicorn
    print("Starting uvicorn server on http://0.0.0.0:8000")
    print("API Documentation: http://localhost:8000/docs")
    print("Press CTRL+C to stop the server")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )