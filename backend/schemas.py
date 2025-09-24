from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: str
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Scenario schemas
class ScenarioBase(BaseModel):
    title: str
    description: str
    scenario_type: str
    duration_minutes: int
    difficulty_level: str = "beginner"
    image_url: Optional[str] = None
    panorama_url: Optional[str] = None
    learning_objectives: Optional[List[str]] = None
    prerequisites: Optional[List[int]] = None

class ScenarioCreate(ScenarioBase):
    pass

class ScenarioResponse(ScenarioBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Quiz schemas
class Question(BaseModel):
    id: int
    question_text: str
    options: List[str]
    correct_answer: int  # Index of correct option
    explanation: Optional[str] = None

class QuizBase(BaseModel):
    title: str
    description: Optional[str] = None
    questions: List[Question]
    passing_score: float = 70.0
    time_limit_minutes: Optional[int] = None

class QuizCreate(QuizBase):
    scenario_id: int

class QuizResponse(QuizBase):
    id: int
    scenario_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Quiz attempt schemas
class QuizAttemptCreate(BaseModel):
    quiz_id: int
    answers: List[int]  # List of answer indices
    completed_at: Optional[datetime] = None

class QuizAttemptResponse(BaseModel):
    id: int
    user_id: int
    quiz_id: int
    answers: List[int]
    score: float
    is_passed: bool
    time_taken_minutes: Optional[float] = None
    started_at: datetime
    completed_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# User session schemas
class UserSessionBase(BaseModel):
    session_token: str
    login_time: datetime
    last_activity: datetime
    logout_time: Optional[datetime] = None
    is_active: bool
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

class UserSessionCreate(UserSessionBase):
    user_id: int

class UserSessionResponse(UserSessionBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# User progress schemas
class UserProgressResponse(BaseModel):
    id: int
    user_id: int
    scenario_id: int
    completion_percentage: float
    is_completed: bool
    last_accessed_at: datetime
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None