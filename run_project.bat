@echo off
title FitChat AI - Start All Services
cd /d %~dp0
start cmd /k "cd BackEnd && yarn nodemon"
start cmd /k "cd FrontEnd && npm run dev"
start cmd /k "cd Python && cd Rule-Base && uvicorn main:app --reload"

:: เปิด VS Code ที่โฟลเดอร์หลักของโปรเจกต์
start code .

:: เปิดเว็บไซต์ในเว็บเบราว์เซอร์ที่ localhost:5173
timeout /t 3 >nul
start http://localhost:5173

echo FitChat AI Services Started Successfully!
exit
