@echo off
echo Installing dependencies for all projects...

 ติดตั้ง dependencies ใน BackEnd
cd BackEnd
echo Installing BackEnd dependencies...
yarn 
cd ..

 ติดตั้ง dependencies ใน FrontEnd
cd FrontEnd
echo Installing FrontEnd dependencies...
npm i
cd ..

 ติดตั้ง dependencies ใน Python
cd Python
echo Installing Python dependencies...
pip install -r requirements.txt
cd ..

echo All dependencies installed successfully!
pause
