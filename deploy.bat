@echo off
echo 🚀 Preparing for deployment...

echo 📦 Building frontend...
cd frontend
call npm run build
cd ..

echo 🔨 Building backend...
call mvn clean package -DskipTests

echo ✅ Build complete! Ready for deployment.
echo.
echo 📋 Next steps:
echo 1. Push to GitHub: git add . && git commit -m "Ready for deployment" && git push
echo 2. Deploy backend on Render.com
echo 3. Deploy frontend on Vercel.com
echo 4. Share the URLs with your team!
echo.
pause
