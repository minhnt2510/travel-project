@echo off
echo Starting Travel App Development Environment...
echo.

echo [1/4] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/4] Seeding Database...
cd backend
call npm run seed
cd ..

timeout /t 2 /nobreak >nul

echo [3/4] Starting Frontend (Expo)...
start "Frontend (Expo)" cmd /k "cd Travel-App && npm start"

echo.
echo ✅ Development servers started!
echo.
echo Backend: http://localhost:4000
echo Frontend: Expo DevTools will open automatically
echo.
echo Press any key to stop all servers...
pause >nul

