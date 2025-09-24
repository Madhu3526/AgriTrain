from sqlalchemy.orm import Session
from models import User, Scenario, Quiz
from auth import get_password_hash
from datetime import datetime

def seed_database(db: Session):
    """Seed the database with initial data."""
    
    # Create sample scenarios
    scenarios_data = [
        {
            "title": "Pest Management",
            "description": "Learn to identify, monitor, and control agricultural pests using integrated pest management strategies.",
            "scenario_type": "pest",
            "duration_minutes": 15,
            "difficulty_level": "beginner",
            "image_url": "/assets/scenario-pest.jpg",
            "panorama_url": "/assets/panorama-pest.jpg",
            "learning_objectives": [
                "Identify common agricultural pests",
                "Understand pest life cycles",
                "Learn integrated pest management techniques",
                "Apply appropriate control measures"
            ],
            "prerequisites": []
        },
        {
            "title": "Smart Irrigation",
            "description": "Master water-efficient irrigation techniques and optimize crop water management systems.",
            "scenario_type": "irrigation",
            "duration_minutes": 20,
            "difficulty_level": "intermediate",
            "image_url": "/assets/scenario-irrigation.jpg",
            "panorama_url": "/assets/panorama-irrigation.jpg",
            "learning_objectives": [
                "Understand water requirements for different crops",
                "Learn efficient irrigation scheduling",
                "Master water conservation techniques",
                "Optimize irrigation system design"
            ],
            "prerequisites": []
        },
        {
            "title": "Crop Selection",
            "description": "Choose the right crops for your climate, soil conditions, and market demands.",
            "scenario_type": "crops",
            "duration_minutes": 18,
            "difficulty_level": "beginner",
            "image_url": "/assets/scenario-crops.jpg",
            "panorama_url": "/assets/panorama-crops.jpg",
            "learning_objectives": [
                "Understand crop requirements",
                "Analyze soil and climate conditions",
                "Evaluate market opportunities",
                "Plan crop rotation strategies"
            ],
            "prerequisites": []
        },
        {
            "title": "Climate Adaptation",
            "description": "Adapt your farming practices to changing climate conditions and weather patterns.",
            "scenario_type": "climate",
            "duration_minutes": 25,
            "difficulty_level": "advanced",
            "image_url": "/assets/scenario-climate.jpg",
            "panorama_url": "/assets/panorama-climate.jpg",
            "learning_objectives": [
                "Understand climate change impacts on agriculture",
                "Learn adaptation strategies",
                "Implement resilient farming practices",
                "Monitor weather patterns and trends"
            ],
            "prerequisites": [1, 2, 3]  # Requires completion of other scenarios
        }
    ]
    
    # Create scenarios
    for scenario_data in scenarios_data:
        existing_scenario = db.query(Scenario).filter(Scenario.title == scenario_data["title"]).first()
        if not existing_scenario:
            scenario = Scenario(**scenario_data)
            db.add(scenario)
    
    db.commit()
    
    # Create sample quizzes
    quizzes_data = [
        {
            "scenario_id": 1,  # Pest Management
            "title": "Pest Management Assessment",
            "description": "Test your knowledge of pest identification and management techniques.",
            "questions": [
                {
                    "id": 1,
                    "question_text": "What is the primary goal of Integrated Pest Management (IPM)?",
                    "options": [
                        "Complete elimination of all pests",
                        "Sustainable pest control using multiple strategies",
                        "Use only chemical pesticides",
                        "Avoid all pest control measures"
                    ],
                    "correct_answer": 1,
                    "explanation": "IPM focuses on sustainable pest control using a combination of biological, cultural, and chemical methods."
                },
                {
                    "id": 2,
                    "question_text": "Which of the following is NOT a cultural pest control method?",
                    "options": [
                        "Crop rotation",
                        "Planting resistant varieties",
                        "Using beneficial insects",
                        "Proper irrigation timing"
                    ],
                    "correct_answer": 2,
                    "explanation": "Using beneficial insects is a biological control method, not cultural."
                },
                {
                    "id": 3,
                    "question_text": "What is the economic threshold in pest management?",
                    "options": [
                        "The cost of pest control measures",
                        "The point where pest damage equals control costs",
                        "The maximum number of pests allowed",
                        "The minimum pesticide application rate"
                    ],
                    "correct_answer": 1,
                    "explanation": "Economic threshold is the pest population level where the cost of control equals the value of damage prevented."
                }
            ],
            "passing_score": 70.0,
            "time_limit_minutes": 10
        },
        {
            "scenario_id": 2,  # Smart Irrigation
            "title": "Irrigation Systems Assessment",
            "description": "Evaluate your understanding of efficient irrigation practices.",
            "questions": [
                {
                    "id": 1,
                    "question_text": "What is the most water-efficient irrigation method?",
                    "options": [
                        "Flood irrigation",
                        "Sprinkler irrigation",
                        "Drip irrigation",
                        "Furrow irrigation"
                    ],
                    "correct_answer": 2,
                    "explanation": "Drip irrigation delivers water directly to plant roots with minimal evaporation and runoff."
                },
                {
                    "id": 2,
                    "question_text": "When is the best time to irrigate crops?",
                    "options": [
                        "Midday when it's hottest",
                        "Early morning or evening",
                        "Late at night",
                        "Anytime during the day"
                    ],
                    "correct_answer": 1,
                    "explanation": "Early morning or evening irrigation reduces water loss due to evaporation and wind."
                },
                {
                    "id": 3,
                    "question_text": "What does ET (Evapotranspiration) measure?",
                    "options": [
                        "Water pressure in irrigation systems",
                        "Water loss from soil and plants",
                        "Irrigation system efficiency",
                        "Crop yield potential"
                    ],
                    "correct_answer": 1,
                    "explanation": "ET measures the combined water loss from soil evaporation and plant transpiration."
                }
            ],
            "passing_score": 70.0,
            "time_limit_minutes": 15
        },
        {
            "scenario_id": 3,  # Crop Selection
            "title": "Crop Selection Assessment",
            "description": "Test your knowledge of crop selection and planning strategies.",
            "questions": [
                {
                    "id": 1,
                    "question_text": "What is the most important factor when selecting crops for a new region?",
                    "options": [
                        "Market price only",
                        "Climate and soil conditions",
                        "Personal preference",
                        "Equipment availability"
                    ],
                    "correct_answer": 1,
                    "explanation": "Climate and soil conditions determine whether crops can grow successfully in a region."
                },
                {
                    "id": 2,
                    "question_text": "What is crop rotation?",
                    "options": [
                        "Turning crops during growth",
                        "Growing different crops in sequence",
                        "Harvesting crops in circles",
                        "Storing crops in rotation"
                    ],
                    "correct_answer": 1,
                    "explanation": "Crop rotation involves growing different crops in the same field in sequential seasons to improve soil health."
                },
                {
                    "id": 3,
                    "question_text": "Which factor is NOT typically considered in crop selection?",
                    "options": [
                        "Soil pH",
                        "Water availability",
                        "Farmer's age",
                        "Market demand"
                    ],
                    "correct_answer": 2,
                    "explanation": "While experience matters, the farmer's age itself is not a direct factor in crop selection decisions."
                }
            ],
            "passing_score": 70.0,
            "time_limit_minutes": 12
        },
        {
            "scenario_id": 4,  # Climate Adaptation
            "title": "Climate Adaptation Assessment",
            "description": "Evaluate your understanding of climate-smart agriculture practices.",
            "questions": [
                {
                    "id": 1,
                    "question_text": "What is climate-smart agriculture?",
                    "options": [
                        "Using only modern technology",
                        "Farming that adapts to and mitigates climate change",
                        "Growing crops indoors only",
                        "Avoiding all traditional practices"
                    ],
                    "correct_answer": 1,
                    "explanation": "Climate-smart agriculture sustainably increases productivity while adapting to climate change and reducing greenhouse gas emissions."
                },
                {
                    "id": 2,
                    "question_text": "Which practice helps build climate resilience in farming?",
                    "options": [
                        "Monoculture farming",
                        "Diversifying crops and livestock",
                        "Removing all trees from farmland",
                        "Using only chemical fertilizers"
                    ],
                    "correct_answer": 1,
                    "explanation": "Diversification reduces risk and improves resilience to climate variability and extreme weather events."
                },
                {
                    "id": 3,
                    "question_text": "What is a key benefit of agroforestry in climate adaptation?",
                    "options": [
                        "Reduces biodiversity",
                        "Increases soil erosion",
                        "Provides windbreaks and carbon sequestration",
                        "Eliminates the need for irrigation"
                    ],
                    "correct_answer": 2,
                    "explanation": "Agroforestry systems provide windbreaks, sequester carbon, improve soil health, and enhance climate resilience."
                }
            ],
            "passing_score": 75.0,
            "time_limit_minutes": 18
        }
    ]
    
    # Create quizzes
    for quiz_data in quizzes_data:
        existing_quiz = db.query(Quiz).filter(Quiz.scenario_id == quiz_data["scenario_id"]).first()
        if not existing_quiz:
            quiz = Quiz(**quiz_data)
            db.add(quiz)
    
    db.commit()
    
    # Create a sample user
    sample_user = db.query(User).filter(User.email == "demo@agritrain.com").first()
    if not sample_user:
        user = User(
            email="demo@agritrain.com",
            username="demo_user",
            hashed_password=get_password_hash("demo123"),
            full_name="Demo User"
        )
        db.add(user)
        db.commit()
    
    print("Database seeded successfully!")

if __name__ == "__main__":
    from database import SessionLocal
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()