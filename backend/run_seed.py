#!/usr/bin/env python3
"""
Script to seed the database with initial data.
Run this script to populate the database with sample scenarios and quizzes.
"""

from database import SessionLocal
from seed_data import seed_database

def main():
    """Run the database seeding process."""
    db = SessionLocal()
    try:
        print("Starting database seeding...")
        seed_database(db)
        print("Database seeding completed successfully!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()