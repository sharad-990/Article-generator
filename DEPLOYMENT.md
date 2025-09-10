# 🚀 Free Deployment Guide

## Option 1: Render (Recommended - Easiest)

### Backend Deployment:
1. Push your code to GitHub
2. Go to [render.com](https://render.com)
3. Connect your GitHub account
4. Click "New Web Service"
5. Select your repository
6. Configure:
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/*.jar`
   - **Environment**: Java
7. Add environment variables:
   - `GOOGLE_AI_API_KEY`: Your API key
   - `GOOGLE_AI_MODEL`: `gemini-2.5-flash`
8. Deploy!

### Frontend Deployment:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set **Root Directory** to `frontend`
4. Add environment variable:
   - `REACT_APP_API_URL`: Your Render backend URL
5. Deploy!

## Option 2: Railway (Alternative)

1. Go to [railway.app](https://railway.app)
2. Connect GitHub
3. Deploy from repository
4. Add environment variables
5. Get your URL

## Option 3: Netlify + Render

1. Deploy backend on Render (same as above)
2. Deploy frontend on Netlify:
   - Connect GitHub
   - Set build command: `cd frontend && npm run build`
   - Set publish directory: `frontend/build`

## 🔧 Configuration Updates Needed

### Update Frontend API URL:
```javascript
// In frontend/src/components/ArticleGenerator.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const response = await fetch(`${API_BASE_URL}/api/generateArticles`, {
```

### Update CORS Settings:
```properties
# In application.properties
spring.web.cors.allowed-origins=${FRONTEND_URL:http://localhost:3000}
```

## 📱 Sharing with Members

Once deployed:
1. Share the frontend URL with your members
2. They can access it from any device
3. No installation required
4. Works on mobile, tablet, desktop

## 💡 Pro Tips

- Use GitHub for version control
- Set up automatic deployments
- Monitor usage on free tiers
- Consider upgrading if you get more users
- Use environment variables for sensitive data

## 🆓 Free Tier Limits

- **Render**: 750 hours/month
- **Vercel**: Unlimited static sites
- **Netlify**: 100GB bandwidth
- **Railway**: $5 credit monthly

Most small teams can stay within these limits!
