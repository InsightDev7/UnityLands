@echo off
title UnityLands
echo Step 1/3 - Installing root dependencies...
call npm install
echo Step 2/3 - Installing client dependencies...
cd client
call npm install
echo Step 3/3 - Starting Angular...
start http://localhost:4200
call npx ng serve --open --host 0.0.0.0
pause
