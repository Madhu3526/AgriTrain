from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn
from fastapi.responses import JSONResponse
from datetime import datetime

from database import get_db, engine
from models import Base, User, Scenario, Quiz, QuizAttempt, UserProgress, UserSession
from schemas import (
    UserCreate, UserResponse, ScenarioResponse, QuizResponse, 
    QuizAttemptCreate, QuizAttemptResponse, UserProgressResponse,
    ScenarioCreate, QuizCreate, UserSessionResponse, UserSessionCreate
)
from auth import create_access_token, verify_token, get_password_hash, verify_password

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AgriTrain API",
    description="Agricultural Training Platform API with 360° Scenarios and AI Guidance",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=False,  # Set to False when allowing all origins
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Dependency to get current user
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

@app.get("/")
async def root():
    return {"message": "AgriTrain API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Add explicit OPTIONS handler for CORS
@app.options("/{path:path}")
async def options_handler(path: str):
    return JSONResponse(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )

# User endpoints
@app.post("/auth/register", response_model=UserResponse)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
        full_name=user.full_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@app.post("/auth/login")
async def login_user(
    credentials: dict,
    request: Request,
    db: Session = Depends(get_db)
):
    email = credentials.get("email")
    password = credentials.get("password")
    
    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Email and password are required"
        )
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": str(user.id)})
    
    # Create user session record
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    
    user_session = UserSession(
        user_id=user.id,
        session_token=access_token,
        ip_address=client_ip,
        user_agent=user_agent
    )
    db.add(user_session)
    db.commit()
    db.refresh(user_session)
    
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user": user,
        "session_id": user_session.id
    }

@app.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

@app.post("/auth/logout")
async def logout_user(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Find active session and mark as inactive
    active_session = db.query(UserSession).filter(
        UserSession.user_id == current_user.id,
        UserSession.is_active == True
    ).first()
    
    if active_session:
        active_session.is_active = False
        active_session.logout_time = datetime.utcnow()
        db.commit()
    
    return {"message": "Logged out successfully"}

# User session endpoints
@app.get("/users/{user_id}/sessions", response_model=List[UserSessionResponse])
async def get_user_sessions(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this user's sessions")
    
    sessions = db.query(UserSession).filter(UserSession.user_id == user_id).all()
    return sessions

@app.get("/users/{user_id}/sessions/active", response_model=List[UserSessionResponse])
async def get_active_user_sessions(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this user's sessions")
    
    sessions = db.query(UserSession).filter(
        UserSession.user_id == user_id,
        UserSession.is_active == True
    ).all()
    return sessions

# Scenario endpoints
@app.get("/scenarios", response_model=List[ScenarioResponse])
async def get_scenarios(db: Session = Depends(get_db)):
    scenarios = db.query(Scenario).all()
    return scenarios

@app.get("/scenarios/{scenario_id}", response_model=ScenarioResponse)
async def get_scenario(scenario_id: int, db: Session = Depends(get_db)):
    scenario = db.query(Scenario).filter(Scenario.id == scenario_id).first()
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return scenario

@app.post("/scenarios", response_model=ScenarioResponse)
async def create_scenario(scenario: ScenarioCreate, db: Session = Depends(get_db)):
    db_scenario = Scenario(**scenario.dict())
    db.add(db_scenario)
    db.commit()
    db.refresh(db_scenario)
    return db_scenario

# Quiz endpoints
@app.get("/scenarios/{scenario_id}/quiz", response_model=QuizResponse)
async def get_scenario_quiz(scenario_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.scenario_id == scenario_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found for this scenario")
    return quiz

@app.post("/quizzes", response_model=QuizResponse)
async def create_quiz(quiz: QuizCreate, db: Session = Depends(get_db)):
    db_quiz = Quiz(**quiz.dict())
    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)
    return db_quiz

# Quiz attempt endpoints
@app.post("/quiz-attempts", response_model=QuizAttemptResponse)
async def submit_quiz_attempt(
    attempt: QuizAttemptCreate, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Calculate score
    quiz = db.query(Quiz).filter(Quiz.id == attempt.quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Simple scoring - count correct answers
    correct_answers = 0
    total_questions = len(quiz.questions)
    
    for i, user_answer in enumerate(attempt.answers):
        if i < len(quiz.questions):
            question = quiz.questions[i]
            correct_answer = question.get("correct_answer") if isinstance(question, dict) else getattr(question, 'correct_answer', None)
            if user_answer == correct_answer:
                correct_answers += 1
    
    score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
    is_passed = score >= quiz.passing_score
    
    # Create quiz attempt
    db_attempt = QuizAttempt(
        user_id=current_user.id,
        quiz_id=attempt.quiz_id,
        answers=attempt.answers,
        score=score,
        is_passed=is_passed,
        started_at=datetime.utcnow(),
        completed_at=attempt.completed_at or datetime.utcnow()
    )
    db.add(db_attempt)
    db.commit()
    db.refresh(db_attempt)
    
    return db_attempt

@app.get("/users/{user_id}/quiz-attempts", response_model=List[QuizAttemptResponse])
async def get_user_quiz_attempts(
    user_id: int, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this user's attempts")
    
    attempts = db.query(QuizAttempt).filter(QuizAttempt.user_id == user_id).all()
    return attempts

# User progress endpoints
@app.get("/users/{user_id}/progress", response_model=List[UserProgressResponse])
async def get_user_progress(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this user's progress")
    
    progress = db.query(UserProgress).filter(UserProgress.user_id == user_id).all()
    return progress

@app.post("/users/{user_id}/progress", response_model=UserProgressResponse)
async def update_user_progress(
    user_id: int,
    progress_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this user's progress")
    
    scenario_id = progress_data.get("scenario_id")
    completion_percentage = progress_data.get("completion_percentage")
    
    if scenario_id is None or completion_percentage is None:
        raise HTTPException(status_code=422, detail="scenario_id and completion_percentage are required")
    
    # Check if progress already exists
    existing_progress = db.query(UserProgress).filter(
        UserProgress.user_id == user_id,
        UserProgress.scenario_id == scenario_id
    ).first()
    
    if existing_progress:
        existing_progress.completion_percentage = completion_percentage
        existing_progress.is_completed = completion_percentage >= 100
        existing_progress.last_accessed_at = datetime.utcnow()
        if completion_percentage >= 100 and not existing_progress.completed_at:
            existing_progress.completed_at = datetime.utcnow()
        db.commit()
        db.refresh(existing_progress)
        return existing_progress
    else:
        new_progress = UserProgress(
            user_id=user_id,
            scenario_id=scenario_id,
            completion_percentage=completion_percentage,
            is_completed=completion_percentage >= 100,
            last_accessed_at=datetime.utcnow(),
            completed_at=datetime.utcnow() if completion_percentage >= 100 else None
        )
        db.add(new_progress)
        db.commit()
        db.refresh(new_progress)
        return new_progress

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)