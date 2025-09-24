@echo off
echo Starting AgriTrain Backend Server...
cd backend
python -m pip install -r requirements.txt
python run.py
pause
