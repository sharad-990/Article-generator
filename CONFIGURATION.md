# Configuration Guide

## Required API Keys

To run the Article Generator application, you need to obtain the following API keys:

### 1. Google AI API Key (Required)
- Visit [Google AI Studio](https://aistudio.google.com/)
- Create a new project or select an existing one
- Click on "Get API Key" in the left sidebar
- Create a new API key
- Copy the key and add it to `src/main/resources/application.properties`:
  ```properties
  spring.ai.google.ai.api-key=your-actual-api-key-here
  ```

### 2. Medium API Token (Required)
- Visit [Medium Integration Tokens](https://medium.com/me/settings)
- Click "Get integration token"
- Enter a description for your token (e.g., "Article Generator App")
- Click "Generate token"
- Copy the token and add it to `src/main/resources/application.properties`:
  ```properties
  medium.api.token=your-actual-token-here
  ```

### 3. AI Detection API Key (Optional)
- Sign up for an AI detection service like [Originality.ai](https://www.originality.ai/)
- Get your API key from the dashboard
- Add it to `src/main/resources/application.properties`:
  ```properties
  ai-detection.api.key=your-actual-api-key-here
  ```

## Environment Variables (Alternative)

Instead of hardcoding API keys in the properties file, you can use environment variables:

1. Create a `.env` file in the project root:
   ```
   GOOGLE_AI_API_KEY=your-google-ai-api-key-here
   MEDIUM_API_TOKEN=your-medium-api-token-here
   AI_DETECTION_API_KEY=your-ai-detection-api-key-here
   ```

2. The application will automatically pick up these environment variables.

## Security Notes

- Never commit API keys to version control
- Use environment variables in production
- Rotate API keys regularly
- Monitor API usage to avoid unexpected charges

## Testing the Configuration

1. Start the backend: `mvn spring-boot:run`
2. Check the logs for any API key validation errors
3. Test the `/api/health` endpoint: `http://localhost:8080/api/health`
4. Try generating articles through the frontend interface
