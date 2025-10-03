# Deployment Guide for Article Generator Backend

## Render.com Docker Deployment

This guide explains how to deploy your Spring Boot backend on Render.com using Docker.

### Prerequisites

1. GitHub repository with your code
2. Render.com account
3. Environment variables configured

### Files Created

- `Dockerfile` - Docker configuration for the Spring Boot application
- `render.yaml` - Render.com deployment configuration

### Environment Variables Required

Set these in your Render.com dashboard:

1. **GOOGLE_AI_API_KEY** - Your Google AI API key
2. **MONGODB_URI** - Your MongoDB connection string
3. **EMAIL_USERNAME** - Your email username for sending emails
4. **EMAIL_PASSWORD** - Your email app password
5. **FRONTEND_URL** - Your frontend application URL

### Deployment Steps

1. **Push to GitHub**: Ensure your code is pushed to your GitHub repository

2. **Connect to Render**:
   - Go to Render.com dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Service**:
   - **Name**: article-generator-backend
   - **Environment**: Docker
   - **Dockerfile Path**: ./Dockerfile
   - **Branch**: main (or your default branch)

4. **Set Environment Variables**:
   - Add all required environment variables in the Render dashboard
   - Make sure to mark sensitive variables as "Sync" = false

5. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

### Docker Configuration

The `Dockerfile` includes:
- OpenJDK 21 base image
- Maven installation
- Application building
- JAR file creation
- Port 8080 exposure
- Production environment configuration

### Render Configuration

The `render.yaml` includes:
- Docker deployment type
- Environment variables
- Production profile activation
- Service configuration

### Health Check

Your application will be available at:
- `https://your-service-name.onrender.com`

### Troubleshooting

1. **Build Failures**: Check the build logs in Render dashboard
2. **Environment Variables**: Ensure all required variables are set
3. **Database Connection**: Verify MongoDB URI is correct
4. **API Keys**: Ensure Google AI API key is valid

### Monitoring

- Check application logs in Render dashboard
- Monitor resource usage
- Set up alerts for downtime