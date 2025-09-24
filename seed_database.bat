@echo off
echo Seeding AgriTrain Database...
cd backend
python run_seed.py
echo.
echo Database seeding completed!
pause