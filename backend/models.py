from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    quiz_attempts = relationship("QuizAttempt", back_populates="user")
    progress = relationship("UserProgress", back_populates="user")
    sessions = relationship("UserSession", back_populates="user")

class Scenario(Base):
    __tablename__ = "scenarios"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    scenario_type = Column(String, nullable=False)  # pest, irrigation, crops, climate
    duration_minutes = Column(Integer, nullable=False)
    difficulty_level = Column(String, default="beginner")  # beginner, intermediate, advanced
    image_url = Column(String, nullable=True)
    panorama_url = Column(String, nullable=True)  # 360° panorama image URL
    learning_objectives = Column(JSON, nullable=True)  # List of learning objectives
    prerequisites = Column(JSON, nullable=True)  # List of prerequisite scenario IDs
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    quiz = relationship("Quiz", back_populates="scenario", uselist=False)
    progress = relationship("UserProgress", back_populates="scenario")

class Quiz(Base):
    __tablename__ = "quizzes"
    
    id = Column(Integer, primary_key=True, index=True)
    scenario_id = Column(Integer, ForeignKey("scenarios.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    questions = Column(JSON, nullable=False)  # List of question objects
    passing_score = Column(Float, default=70.0)  # Minimum score to pass (percentage)
    time_limit_minutes = Column(Integer, nullable=True)  # Optional time limit
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    scenario = relationship("Scenario", back_populates="quiz")
    attempts = relationship("QuizAttempt", back_populates="quiz")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    answers = Column(JSON, nullable=False)  # List of user's answers
    score = Column(Float, nullable=False)  # Calculated score (percentage)
    is_passed = Column(Boolean, default=False)  # Whether the attempt passed
    time_taken_minutes = Column(Float, nullable=True)  # Time taken to complete
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="quiz_attempts")
    quiz = relationship("Quiz", back_populates="attempts")

class UserSession(Base):
    __tablename__ = "user_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_token = Column(String, unique=True, index=True, nullable=False)
    login_time = Column(DateTime, default=datetime.utcnow)
    last_activity = Column(DateTime, default=datetime.utcnow)
    logout_time = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="sessions")

class UserProgress(Base):
    __tablename__ = "user_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scenario_id = Column(Integer, ForeignKey("scenarios.id"), nullable=False)
    completion_percentage = Column(Float, default=0.0)  # 0-100
    is_completed = Column(Boolean, default=False)
    last_accessed_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="progress")
    scenario = relationship("Scenario", back_populates="progress")